import pandas as pd
import numpy as np
import pickle
import joblib
from sklearn.preprocessing import LabelEncoder, OneHotEncoder
from sklearn.ensemble import RandomForestClassifier
from haversine import haversine, Unit
from datetime import datetime

DATA_DIR = "/home/kirito/.cache/kagglehub/datasets/kartik2112/fraud-detection/versions/1"

print("Loading training data...")
train = pd.read_csv(f"{DATA_DIR}/fraudTrain.csv")
test = pd.read_csv(f"{DATA_DIR}/fraudTest.csv")
df = pd.concat([train, test], ignore_index=True)
print(f"Total rows: {len(df)}")

df = df.drop(columns=["Unnamed: 0"], errors="ignore")
df = df.drop_duplicates(subset=["trans_num"])
print(f"After dedup: {len(df)}")

sample_size = min(200000, len(df))
fraud = df[df["is_fraud"] == 1]
non_fraud = df[df["is_fraud"] == 0].sample(n=sample_size // 2, random_state=42)
df = pd.concat([fraud, non_fraud], ignore_index=True).sample(frac=1, random_state=42)
print(f"Using {len(df)} rows for training")

df["trans_date_trans_time"] = pd.to_datetime(df["trans_date_trans_time"])
df["dob"] = pd.to_datetime(df["dob"])
df["amt"] = df["amt"].fillna(0.0)

df["hour"] = df["trans_date_trans_time"].dt.hour
df["age"] = (df["trans_date_trans_time"] - df["dob"]).dt.days // 365

for col in ["city", "merchant", "first", "last", "street", "state", "job", "trans_num", "zip"]:
    df[col] = df[col].astype(str).fillna("unknown")
df["gender"] = df["gender"].fillna("F")
df["category"] = df["category"].fillna("shopping_net")

def compute_distance(row):
    try:
        return haversine(
            (float(row["lat"]), float(row["long"])),
            (float(row["merch_lat"]), float(row["merch_long"])),
            unit=Unit.KILOMETERS
        )
    except:
        return 0.0

print("Computing distances...")
df["distance"] = df.apply(compute_distance, axis=1)

print("Encoding gender...")
le = LabelEncoder()
le.fit(["F", "M"])
df["gender_enc"] = le.transform(df["gender"])

print("Encoding category...")
categories = [
    'entertainment', 'food_dining', 'gas_transport', 'grocery_net',
    'grocery_pos', 'health_fitness', 'home', 'kids_pets', 'misc_net',
    'misc_pos', 'personal_care', 'shopping_net', 'shopping_pos', 'travel'
]
enc = OneHotEncoder(sparse_output=False, categories=[categories])
enc.fit(df[["category"]])
cat_encoded = enc.transform(df[["category"]])

feature_cols = enc.get_feature_names_out()

X = np.column_stack([
    df["amt"].values.astype(float),
    df["gender_enc"].values,
    df["hour"].values,
    df["age"].values,
    df["distance"].values,
    cat_encoded
])
y = df["is_fraud"].values.astype(int)

print(f"Features shape: {X.shape}")
print(f"Fraud ratio: {y.mean():.4f}")
print("Training RandomForest...")

model = RandomForestClassifier(
    n_estimators=50,
    max_depth=15,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced"
)
model.fit(X, y)

from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
y_pred = model.predict(X)
print(f"Training accuracy:  {accuracy_score(y, y_pred):.4f}")
print(f"Precision: {precision_score(y, y_pred):.4f}")
print(f"Recall:    {recall_score(y, y_pred):.4f}")
print(f"F1 score:  {f1_score(y, y_pred):.4f}")

print("Saving models...")
with open("backend/label_encoder.pkl", "wb") as f:
    pickle.dump(le, f)

with open("backend/category_encoder.pkl", "wb") as f:
    pickle.dump(enc, f)

joblib.dump(model, "backend/fraud_model.pkl")

print("Done! Files saved:")
print("  backend/label_encoder.pkl")
print("  backend/category_encoder.pkl")
print("  backend/fraud_model.pkl")
print(f"\nModel expects {model.n_features_in_} features")
print("Feature order: [amount, gender, hour, age, distance, *category_onehot]")
