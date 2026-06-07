import { useState, useEffect, useRef, useCallback } from "react";
import { useNotifications } from "../../context/NotificationContext";
import "./IDVerify.css";

const MODEL_URL = "https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@0.22.2/weights";
const THRESHOLD = 0.55;

const TX_LABELS = {
  virement: "Virement bancaire",
  retrait: "Retrait espèces",
  depot: "Dépôt chèque",
  paiement: "Paiement facture",
};

const TX_ICONS = { virement: "📤", retrait: "💵", depot: "📋", paiement: "💳" };

let faceapi = null;

function IDVerify() {
  const { showToast } = useNotifications();

  const [step, setStep] = useState(1);
  const [txType, setTxType] = useState("virement");
  const [amount, setAmount] = useState("");
  const [benef, setBenef] = useState("");
  const [aiLoaded, setAiLoaded] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [faceCount, setFaceCount] = useState(0);
  const [selfieBadge, setSelfieBadge] = useState({ type: "", text: "En attente" });
  const [selfieDone, setSelfieDone] = useState(false);
  const [selfieDataUrl, setSelfieDataUrl] = useState("");
  const [idBadge, setIdBadge] = useState({ type: "", text: "Aucun document" });
  const [idImageUrl, setIdImageUrl] = useState("");
  const [resultOk, setResultOk] = useState(null);
  const [loadingAI, setLoadingAI] = useState(true);
  const [capturing, setCapturing] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const rafRef = useRef(null);
  const selfieDescRef = useRef(null);
  const idDescRef = useRef(null);
  const runDetectionRef = useRef(null);
  const cameraActiveRef = useRef(false);

  // ── Load face-api models ──────────────────────────────────────
  useEffect(() => {
    faceapi = window.faceapi;
    if (!faceapi) {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
      s.onload = async () => {
        faceapi = window.faceapi;
        try {
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          await faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL);
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
          setAiLoaded(true);
          setLoadingAI(false);
        } catch {
          showToast("Erreur de chargement du moteur IA", "error");
          setLoadingAI(false);
        }
      };
      document.body.appendChild(s);
    }
  }, [showToast]);

  // ── Face detection loop ──────────────────────────────────────
  const runDetection = useCallback(async () => {
    if (!cameraActiveRef.current) return;
    const vid = videoRef.current;
    if (!vid || !vid.videoWidth) { rafRef.current = requestAnimationFrame(runDetectionRef.current); return; }
    if (!faceapi) { rafRef.current = requestAnimationFrame(runDetectionRef.current); return; }
    try {
      const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.45 });
      const dets = await faceapi
        .detectAllFaces(vid, opts)
        .withFaceLandmarks(true);
      const ctx = canvasRef.current?.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setFaceCount(dets.length);
      if (dets.length === 1) {
        setSelfieBadge({ type: "ok", text: "✓ Visage centré" });
        if (ctx) {
          const r = faceapi.resizeResults(dets, { width: vid.videoWidth, height: vid.videoHeight });
          ctx.strokeStyle = "#8B5CF6";
          ctx.lineWidth = 2;
          const { x, y, width, height } = r[0].detection.box;
          ctx.strokeRect(x, y, width, height);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, r);
        }
      } else if (dets.length > 1) {
        setSelfieBadge({ type: "warn", text: `${dets.length} visages détectés` });
      } else {
        setSelfieBadge({ type: "err", text: "Aucun visage détecté" });
      }
    } catch { /* detection errors silently continue the loop */ }
    rafRef.current = requestAnimationFrame(runDetectionRef.current);
  }, []);

  useEffect(() => { runDetectionRef.current = runDetection; }, [runDetection]);

  // ── Camera ────────────────────────────────────────────────────
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 960 } },
      });
      const vid = videoRef.current;
      vid.srcObject = stream;
      streamRef.current = stream;
      vid.onloadedmetadata = () => {
        vid.play();
        cameraActiveRef.current = true;
        setCameraOn(true);
        setSelfieBadge({ type: "", text: "Caméra active..." });
        runDetectionRef.current();
      };
    } catch {
      showToast("Accès à la caméra refusé", "error");
    }
  }, [showToast]);

  const stopCamera = useCallback(() => {
    cameraActiveRef.current = false;
    setCameraOn(false);
    cancelAnimationFrame(rafRef.current);
    (streamRef.current?.getTracks() ?? []).forEach((t) => t.stop());
    const vid = videoRef.current;
    if (vid) vid.srcObject = null;
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, 640, 480);
  }, []);

  const handleCapture = async () => {
    setCapturing(true);
    const vid = videoRef.current;
    const tmp = document.createElement("canvas");
    tmp.width = vid.videoWidth;
    tmp.height = vid.videoHeight;
    tmp.getContext("2d").drawImage(vid, 0, 0);
    const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.45 });
    const det = await faceapi
      .detectSingleFace(tmp, opts)
      .withFaceLandmarks(true)
      .withFaceDescriptor();
    if (!det) {
      showToast("Visage non détecté. Réessayez.", "error");
      setCapturing(false);
      return;
    }
    selfieDescRef.current = det.descriptor;
    setSelfieDataUrl(tmp.toDataURL("image/jpeg", 0.92));
    setSelfieDone(true);
    setSelfieBadge({ type: "ok", text: "✓ Identité capturée" });
    stopCamera();
    setCapturing(false);
    showToast("Capture réussie !", "success");
    setTimeout(() => setStep(3), 800);
  };

  const retryCam = () => {
    selfieDescRef.current = null;
    setSelfieDone(false);
    setSelfieDataUrl("");
    setSelfieBadge({ type: "", text: "En attente" });
    startCamera();
  };

  // ── ID upload ──────────────────────────────────────────────────
  const handleIdFile = async (file) => {
    if (!file) return;
    setIdBadge({ type: "warn", text: "Analyse du document..." });
    const reader = new FileReader();
    reader.onload = async (ev) => {
      setIdImageUrl(ev.target.result);
      const el = await faceapi.fetchImage(ev.target.result);
      const opts = new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 });
      const det = await faceapi
        .detectSingleFace(el, opts)
        .withFaceLandmarks(true)
        .withFaceDescriptor();
      if (!det) {
        setIdBadge({ type: "err", text: "✗ Aucun visage sur le document" });
        showToast("Aucun visage détecté sur le document", "error");
        return;
      }
      idDescRef.current = det.descriptor;
      setIdBadge({ type: "ok", text: "✓ Document analysé" });
      showToast("Document vérifié — comparaison...", "info");
      setTimeout(compareFaces, 800);
    };
    reader.readAsDataURL(file);
  };

  const compareFaces = () => {
    if (!selfieDescRef.current || !idDescRef.current) {
      showToast("Données manquantes", "error");
      return;
    }
    const dist = faceapi.euclideanDistance(selfieDescRef.current, idDescRef.current);
    setResultOk(dist < THRESHOLD);
    setStep(4);
  };

  const clearId = () => {
    idDescRef.current = null;
    setIdImageUrl("");
    setIdBadge({ type: "", text: "Aucun document" });
  };

  // ── Navigation between steps ───────────────────────────────────
  const goToStep2 = () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) { showToast("Saisissez un montant valide", "error"); return; }
    if (!benef.trim()) { showToast("Saisissez le bénéficiaire", "error"); return; }
    setStep(2);
  };

  const [txRef] = useState(() => `ATT-${Date.now().toString(36).toUpperCase().slice(-7)}`);
  const fmtNum = useCallback((n) => new Intl.NumberFormat("fr-MA", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n), []);

  return (
    <div className="idv-app">
      {/* ── STEP 1: Transaction ───────────────────────────── */}
      {step === 1 && (
        <div className="idv-screen active">
          <div className="idv-hd">
            <div className="idv-hd-top">
              <div className="idv-brand">
                <div className="idv-brand-mark"><span /><span /><span /></div>
                <div>
                  <div className="idv-brand-name">SecureBank</div>
                  <div className="idv-brand-sub">Banque &amp; Assurances</div>
                </div>
              </div>
            </div>
            <div className="idv-hd-title">Nouvelle transaction</div>
            <div className="idv-hd-step">Étape 1 sur 3 — Saisie</div>
            <div className="idv-progress"><span className="active" /><span /><span /><span /></div>
          </div>
          <div className="idv-cnt">
            <div className="idv-sec-title">Type d'opération</div>
            <div className="idv-sec-sub">Sélectionnez l'opération à effectuer</div>
            <div className="idv-tx-grid">
              {["virement", "retrait", "depot", "paiement"].map((t) => (
                <button key={t}
                  className={`idv-tx-btn${txType === t ? " sel" : ""}`}
                  onClick={() => setTxType(t)}
                >
                  <span className="idv-tx-icon">{TX_ICONS[t]}</span>
                  <span className="idv-tx-label">{TX_LABELS[t]}</span>
                </button>
              ))}
            </div>
            <div className="idv-field">
              <div className="idv-field-lbl">Montant</div>
              <div className="idv-field-box">
                <input type="number" placeholder="0,00" min="1" step="0.01"
                  value={amount} onChange={(e) => setAmount(e.target.value)} />
                <span className="idv-field-unit">MAD</span>
              </div>
            </div>
            <div className="idv-field">
              <div className="idv-field-lbl">Bénéficiaire</div>
              <div className="idv-field-box">
                <input type="text" placeholder="Nom complet du bénéficiaire"
                  value={benef} onChange={(e) => setBenef(e.target.value)} />
              </div>
            </div>
            <button className="idv-btn idv-btn-primary" onClick={goToStep2}>
              Continuer — Vérification sécurisée &nbsp;→
            </button>
            <p className="idv-sec-note">🔒 &nbsp;Connexion chiffrée · Données non transmises</p>
          </div>
        </div>
      )}

      {/* ── STEP 2: Camera selfie ──────────────────────────── */}
      {step === 2 && (
        <div className="idv-screen active">
          <div className="idv-hd">
            <div className="idv-hd-top">
              <button className="idv-back-btn" onClick={() => { stopCamera(); setStep(1); }}>‹</button>
              <div className="idv-brand">
                <div className="idv-brand-mark"><span /><span /><span /></div>
                <div className="idv-brand-name">SecureBank</div>
              </div>
            </div>
            <div className="idv-hd-title">Vérification biométrique</div>
            <div className="idv-hd-step">Étape 2 sur 3 — Identité</div>
            <div className="idv-progress"><span className="done" /><span className="active" /><span /><span /></div>
          </div>
          <div className="idv-cnt">
            {loadingAI && (
              <div id="idv-ai-badge">
                <span className="idv-spin-amber" />
                Chargement du moteur IA sécurisé...
              </div>
            )}
            <div className="idv-sec-title">Votre visage</div>
            <div className="idv-sec-sub">Centrez votre visage dans le cadre et restez immobile.</div>
            <div className={`idv-cam-wrap${cameraOn ? " scanning" : ""}`}>
              <video ref={videoRef} muted playsInline />
              <canvas ref={canvasRef} />
              <div className={`idv-oval-guide${selfieBadge.type === "ok" ? " ok" : selfieBadge.type === "warn" || selfieBadge.type === "err" ? " bad" : ""}`} />
              <div className="idv-scan-line" />
              <div className="idv-cam-corners"><em /><em /><em /><em /></div>
              <div className="idv-cam-hint-lbl" id="idv-cam-hint">
                {!cameraOn ? "Démarrez la caméra" : faceCount === 0 ? "Placez votre visage dans l'ovale" : faceCount === 1 ? "Parfait — appuyez sur Capturer" : "Un seul visage autorisé"}
              </div>
              {selfieDataUrl && <img id="idv-selfie-preview" src={selfieDataUrl} alt="" />}
            </div>
            <div className="idv-status-row">
              <span className={`idv-badge${selfieBadge.type ? " " + selfieBadge.type : ""}`}>
                <span className="idv-dot" />{selfieBadge.text}
              </span>
              <span className="idv-face-lbl">{faceCount > 0 ? `${faceCount} visage${faceCount > 1 ? "s" : ""} détecté${faceCount > 1 ? "s" : ""}` : ""}</span>
            </div>
            {!selfieDone ? (
              <>
                {!cameraOn ? (
                  <button className="idv-btn idv-btn-primary" disabled={!aiLoaded} onClick={startCamera}>
                    Démarrer la caméra
                  </button>
                ) : (
                  <button className="idv-btn idv-btn-success" onClick={handleCapture} disabled={faceCount !== 1 || capturing}>
                    {capturing ? <><span className="idv-spin" />&nbsp;Analyse...</> : "📸  Capturer"}
                  </button>
                )}
              </>
            ) : (
              <button className="idv-btn idv-btn-outline" onClick={retryCam}>Recommencer</button>
            )}
          </div>
        </div>
      )}

      {/* ── STEP 3: ID document ────────────────────────────── */}
      {step === 3 && (
        <div className="idv-screen active">
          <div className="idv-hd">
            <div className="idv-hd-top">
              <button className="idv-back-btn" onClick={() => { clearId(); setStep(2); }}>‹</button>
              <div className="idv-brand">
                <div className="idv-brand-mark"><span /><span /><span /></div>
                <div className="idv-brand-name">SecureBank</div>
              </div>
            </div>
            <div className="idv-hd-title">Carte d'identité nationale</div>
            <div className="idv-hd-step">Étape 3 sur 3 — Document</div>
            <div className="idv-progress"><span className="done" /><span className="done" /><span className="active" /><span /></div>
          </div>
          <div className="idv-cnt">
            <div className="idv-sec-title">Votre CIN</div>
            <div className="idv-sec-sub">Importez une photo claire de votre Carte d'Identité Nationale.</div>
            <div className="idv-id-zone" onClick={() => document.getElementById("idv-id-file").click()}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("drag"); }}
              onDragLeave={(e) => e.currentTarget.classList.remove("drag")}
              onDrop={(e) => { e.preventDefault(); e.currentTarget.classList.remove("drag"); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("image/")) handleIdFile(f); else showToast("Format non supporté", "error"); }}
            >
              {idImageUrl && <img id="idv-id-img" src={idImageUrl} alt="" />}
              {!idImageUrl && (
                <div id="idv-id-placeholder">
                  <span className="idv-id-ico">🪪</span>
                  <span className="idv-id-lbl">Déposez votre CIN ici</span>
                  <span className="idv-id-sub">ou appuyez pour sélectionner</span>
                  <span className="idv-id-fmt">JPG · PNG · WEBP</span>
                </div>
              )}
            </div>
            <input type="file" id="idv-id-file" accept="image/jpeg,image/png,image/webp"
              onChange={(e) => handleIdFile(e.target.files[0])} />
            <div className="idv-status-row">
              <span className={`idv-badge${idBadge.type ? " " + idBadge.type : ""}`}>
                <span className="idv-dot" />{idBadge.text}
              </span>
              {idImageUrl && <button id="idv-btn-clr" onClick={clearId}>Supprimer</button>}
            </div>
            <button className="idv-btn idv-btn-outline"
              onClick={() => document.getElementById("idv-id-file").click()}>
              📁 &nbsp;Choisir un fichier
            </button>
            <p className="idv-sec-note">🔒 &nbsp;Document analysé localement · Non transmis</p>
          </div>
        </div>
      )}

      {/* ── STEP 4: Result ─────────────────────────────────── */}
      {step === 4 && (
        <div className="idv-screen active">
          <div className="idv-hd">
            <div className="idv-hd-top">
              <div className="idv-brand">
                <div className="idv-brand-mark"><span /><span /><span /></div>
                <div className="idv-brand-name">SecureBank</div>
              </div>
            </div>
            <div className="idv-hd-title">{resultOk ? "Transaction confirmée" : "Transaction bloquée"}</div>
            <div className="idv-progress"><span className="done" /><span className="done" /><span className="done" /><span className="active" /></div>
          </div>
          <div className="idv-result-body">
            <div className={`idv-result-circle${resultOk ? " ok" : " fraud"}`}>{resultOk ? "✅" : "🚫"}</div>
            <div className={`idv-result-verdict${resultOk ? " ok" : " fraud"}`}>
              {resultOk ? "Transaction validée" : "Transaction bloquée"}
            </div>
            <div className="idv-result-msg" dangerouslySetInnerHTML={{
              __html: resultOk
                ? "Votre identité a été vérifiée avec succès. La transaction a été <strong>autorisée</strong>."
                : "Votre identité ne correspond pas au document fourni. La transaction a été <strong>annulée</strong> pour des raisons de sécurité.",
            }} />
            <div className={`idv-result-card${!resultOk ? " fraud" : ""}`}>
              <div className="idv-rrow">
                <span className="idv-rlbl">Montant</span>
                <span className={`idv-rval${resultOk ? " amount" : " blocked"}`}>
                  {fmtNum(parseFloat(amount))} MAD
                </span>
              </div>
              <div className="idv-rrow">
                <span className="idv-rlbl">Bénéficiaire</span>
                <span className="idv-rval">{benef}</span>
              </div>
              <div className="idv-rrow">
                <span className="idv-rlbl">Type d'opération</span>
                <span className="idv-rval">{TX_LABELS[txType]}</span>
              </div>
              {resultOk && (
                <div className="idv-rrow">
                  <span className="idv-rlbl">Référence</span>
                  <span className="idv-rval ref">{txRef}</span>
                </div>
              )}
              {!resultOk && (
                <div className="idv-rrow">
                  <span className="idv-rlbl">Motif</span>
                  <span className="idv-rval blocked" style={{ fontSize: ".8rem" }}>Vérification biométrique échouée</span>
                </div>
              )}
            </div>
            <button className="idv-btn idv-btn-primary" style={{ maxWidth: 320 }} onClick={() => window.location.reload()}>
              {resultOk ? "Retour à l'accueil" : "Réessayer"}
            </button>
            {!resultOk && (
              <p className="idv-fraud-note">
                Si vous pensez qu'il s'agit d'une erreur, contactez le service client au<br />
                <strong>0801 00 20 20</strong>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default IDVerify;
