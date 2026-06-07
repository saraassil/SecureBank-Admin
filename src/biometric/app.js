/* eslint-disable */
'use strict';

const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights';
const THRESHOLD = 0.55;

const TX_LABELS = {
  virement: 'Virement bancaire',
  retrait:  'Retrait espèces',
  depot:    'Dépôt chèque',
  paiement: 'Paiement facture',
};

const STATE = {
  tx:         'virement',
  amount:     null,
  benef:      null,
  selfieDesc: null,
  idDesc:     null,
  cameraOn:   false,
  raf:        null,
};

const $ = id => document.getElementById(id);

function go(screenId) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  $(screenId).classList.add('active');
  window.scrollTo(0, 0);
}

// ── Chargement des modèles ─────────────────────────────────────────────────────

window.addEventListener('load', async () => {
  try {
    await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
    await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
    await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
    $('ai-badge').classList.add('hidden');
    $('btn-cam').disabled    = false;
    $('btn-cam').textContent = 'Démarrer la caméra';
  } catch {
    $('ai-badge').innerHTML = '⚠️ &nbsp;Erreur de chargement du moteur IA';
    toast('Vérifiez votre connexion et rechargez la page.');
  }
});

// ── Écran 1 : Transaction ──────────────────────────────────────────────────────

function selTx(btn) {
  document.querySelectorAll('.tx-btn').forEach(b => b.classList.remove('sel'));
  btn.classList.add('sel');
  STATE.tx = btn.dataset.tx;
}

function goS2() {
  const amount = parseFloat($('tx-amount').value);
  const benef  = $('tx-benef').value.trim();
  if (!amount || amount <= 0) { toast('Saisissez un montant valide.');         return; }
  if (!benef)                  { toast('Saisissez le nom du bénéficiaire.'); return; }
  STATE.amount = amount;
  STATE.benef  = benef;
  go('s2');
}

// ── Écran 2 : Caméra ───────────────────────────────────────────────────────────

$('btn-cam').onclick = startCamera;

async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
    });
    const vid = $('video');
    vid.srcObject = stream;
    vid.onloadedmetadata = () => {
      $('cam-canvas').width  = vid.videoWidth;
      $('cam-canvas').height = vid.videoHeight;
      STATE.cameraOn = true;
      $('cam-zone').classList.add('scanning');
      $('btn-cam').textContent    = 'Arrêter';
      $('btn-cam').onclick        = stopCamera;
      $('btn-capture').style.display = 'flex';
      setBadge('selfie-badge', '', 'Caméra active...');
      runDetection();
    };
  } catch {
    toast('Accès à la caméra refusé. Autorisez-la dans les paramètres du navigateur.');
  }
}

function stopCamera(keepPreview = false) {
  STATE.cameraOn = false;
  cancelAnimationFrame(STATE.raf);
  const vid = $('video');
  (vid.srcObject?.getTracks() ?? []).forEach(t => t.stop());
  vid.srcObject = null;
  $('cam-zone').classList.remove('scanning');
  $('cam-canvas').getContext('2d').clearRect(0, 0, $('cam-canvas').width, $('cam-canvas').height);
  $('oval').className       = 'oval-guide';
  $('cam-hint').textContent = 'Caméra arrêtée';
  $('face-count').textContent = '';
  if (!keepPreview) {
    $('btn-capture').style.display = 'none';
    setBadge('selfie-badge', '', 'En attente');
  }
  $('btn-cam').textContent = 'Démarrer la caméra';
  $('btn-cam').onclick     = startCamera;
}

async function runDetection() {
  if (!STATE.cameraOn) return;

  const vid  = $('video');
  const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: .45 });
  const dets = await faceapi.detectAllFaces(vid, opts).withFaceLandmarks(true);
  const ctx  = $('cam-canvas').getContext('2d');
  ctx.clearRect(0, 0, $('cam-canvas').width, $('cam-canvas').height);

  const n = dets.length;
  $('face-count').textContent = n > 0 ? `${n} visage${n > 1 ? 's' : ''} détecté${n > 1 ? 's' : ''}` : '';

  if (n === 1) {
    $('oval').className       = 'oval-guide ok';
    $('cam-hint').textContent = 'Parfait — appuyez sur Capturer';
    setBadge('selfie-badge', 'ok', '✓ Visage centré');
    $('btn-capture').disabled = false;
    const r = faceapi.resizeResults(dets, { width: vid.videoWidth, height: vid.videoHeight });
    ctx.strokeStyle = '#E2001A';
    ctx.lineWidth   = 2;
    const { x, y, width, height } = r[0].detection.box;
    ctx.strokeRect(x, y, width, height);
    faceapi.draw.drawFaceLandmarks($('cam-canvas'), r);

  } else if (n > 1) {
    $('oval').className       = 'oval-guide bad';
    $('cam-hint').textContent = 'Un seul visage autorisé';
    setBadge('selfie-badge', 'warn', `${n} visages détectés`);
    $('btn-capture').disabled = true;

  } else {
    $('oval').className       = 'oval-guide';
    $('cam-hint').textContent = "Placez votre visage dans l'ovale";
    setBadge('selfie-badge', 'err', 'Aucun visage détecté');
    $('btn-capture').disabled = true;
  }

  STATE.raf = requestAnimationFrame(runDetection);
}

$('btn-capture').onclick = async () => {
  $('btn-capture').innerHTML = '<span class="spin"></span>&nbsp;Analyse...';
  $('btn-capture').disabled  = true;

  const vid = $('video');
  const tmp = document.createElement('canvas');
  tmp.width  = vid.videoWidth;
  tmp.height = vid.videoHeight;
  tmp.getContext('2d').drawImage(vid, 0, 0);

  const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: .45 });
  const det  = await faceapi.detectSingleFace(tmp, opts).withFaceLandmarks(true).withFaceDescriptor();

  if (!det) {
    toast('Visage non détecté. Repositionnez-vous et réessayez.');
    $('btn-capture').innerHTML = '📸 &nbsp;Capturer';
    $('btn-capture').disabled  = false;
    return;
  }

  STATE.selfieDesc = det.descriptor;

  $('selfie-preview').src          = tmp.toDataURL('image/jpeg', .92);
  $('selfie-preview').style.display = 'block';
  $('video').style.visibility       = 'hidden';

  stopCamera(true);
  $('btn-cam').style.display      = 'none';
  $('btn-capture').style.display  = 'none';
  $('btn-retry').style.display    = 'flex';
  setBadge('selfie-badge', 'ok', '✓ Identité capturée');
  toast('Capture réussie ! Passage au document...');
  setTimeout(() => go('s3'), 1100);
};

function retryCam() {
  STATE.selfieDesc = null;
  $('selfie-preview').style.display = 'none';
  $('video').style.visibility       = 'visible';
  $('btn-retry').style.display      = 'none';
  $('btn-cam').style.display        = '';
  setBadge('selfie-badge', '', 'En attente');
  startCamera();
}

function goS1() {
  stopCamera();
  go('s1');
}

// ── Écran 3 : Document CIN ─────────────────────────────────────────────────────

$('id-file').onchange = e => loadIdFile(e.target.files[0]);

function dragOver(e)  { e.preventDefault(); $('id-zone').classList.add('drag'); }
function dragLeave()  { $('id-zone').classList.remove('drag'); }
function dropFile(e)  {
  e.preventDefault();
  $('id-zone').classList.remove('drag');
  const f = e.dataTransfer.files[0];
  if (f?.type.startsWith('image/')) loadIdFile(f);
  else toast('Format non supporté. Utilisez JPG, PNG ou WEBP.');
}

async function loadIdFile(file) {
  if (!file) return;
  setBadge('id-badge', 'warn', 'Analyse du document...');
  $('id-placeholder').style.display = 'none';

  const reader = new FileReader();
  reader.onload = async ev => {
    $('id-img').src          = ev.target.result;
    $('id-img').style.display = 'block';
    $('btn-clr').style.display = '';

    const el   = await faceapi.fetchImage(ev.target.result);
    const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: .3 });
    const det  = await faceapi.detectSingleFace(el, opts).withFaceLandmarks(true).withFaceDescriptor();

    if (!det) {
      setBadge('id-badge', 'err', '✗ Aucun visage sur le document');
      toast('Aucun visage détecté. Utilisez une image plus nette.');
      return;
    }

    STATE.idDesc = det.descriptor;
    setBadge('id-badge', 'ok', '✓ Document analysé');
    toast('Document vérifié — comparaison en cours...');
    setTimeout(compareAndShow, 800);
  };
  reader.readAsDataURL(file);
}

function clearId() {
  STATE.idDesc = null;
  $('id-img').style.display         = 'none';
  $('id-img').src                   = '';
  $('id-placeholder').style.display = 'flex';
  $('btn-clr').style.display        = 'none';
  $('id-file').value                = '';
  setBadge('id-badge', '', 'Aucun document');
}

function goS2back() {
  clearId();
  go('s2');
}

// ── Comparaison & résultat ─────────────────────────────────────────────────────

function compareAndShow() {
  if (!STATE.selfieDesc || !STATE.idDesc) { toast('Données manquantes. Recommencez.'); return; }
  const dist = faceapi.euclideanDistance(STATE.selfieDesc, STATE.idDesc);
  showResult(dist < THRESHOLD);
}

function showResult(ok) {
  go('s4');
  $('result-hd-title').textContent = ok ? 'Transaction confirmée' : 'Transaction bloquée';

  const ref = 'ATT-' + Date.now().toString(36).toUpperCase().slice(-7);
  const fmt = n => new Intl.NumberFormat('fr-MA', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  if (ok) {
    $('result-body').innerHTML = `
      <div class="result-circle ok">✅</div>
      <div class="result-verdict ok">Transaction validée</div>
      <div class="result-msg">
        Votre identité a été vérifiée avec succès.<br/>
        La transaction a été <strong>autorisée</strong>.
      </div>
      <div class="result-card">
        <div class="rrow"><span class="rlbl">Montant</span>       <span class="rval amount">${fmt(STATE.amount)} MAD</span></div>
        <div class="rrow"><span class="rlbl">Bénéficiaire</span>  <span class="rval">${STATE.benef}</span></div>
        <div class="rrow"><span class="rlbl">Type d'opération</span><span class="rval">${TX_LABELS[STATE.tx]}</span></div>
        <div class="rrow"><span class="rlbl">Référence</span>     <span class="rval ref">${ref}</span></div>
      </div>
      <button class="btn btn-red" style="max-width:320px;" onclick="location.reload()">
        Retour à l'accueil
      </button>`;
  } else {
    $('result-body').innerHTML = `
      <div class="result-circle fraud">🚫</div>
      <div class="result-verdict fraud">Transaction bloquée</div>
      <div class="result-msg" style="color:var(--red);font-weight:700;margin-bottom:8px;">Fraude détectée</div>
      <div class="result-msg">
        Votre identité ne correspond pas au document fourni.
        La transaction a été <strong>annulée</strong> pour des raisons de sécurité.
      </div>
      <div class="result-card" style="border-left:3px solid var(--red);">
        <div class="rrow"><span class="rlbl">Montant bloqué</span><span class="rval blocked">${fmt(STATE.amount)} MAD</span></div>
        <div class="rrow"><span class="rlbl">Bénéficiaire</span>  <span class="rval">${STATE.benef}</span></div>
        <div class="rrow"><span class="rlbl">Motif</span>         <span class="rval blocked" style="font-size:.8rem;">Vérification biométrique échouée</span></div>
      </div>
      <button class="btn btn-red" style="max-width:320px;" onclick="location.reload()">Réessayer</button>
      <p class="fraud-note">
        Si vous pensez qu'il s'agit d'une erreur, contactez le service client au
        <strong style="color:var(--text);">0801 00 20 20</strong>
      </p>`;
  }
}

// ── Utilitaires ────────────────────────────────────────────────────────────────

function setBadge(id, type, text) {
  const el = $(id);
  el.className = 'badge' + (type ? ' ' + type : '');
  el.innerHTML = `<span class="dot"></span>${text}`;
}

function toast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3000);
}
