# churn_app/utils/model_utils.py

import pandas as pd
import xgboost as xgb
import pickle
from sklearn.model_selection import train_test_split

def retrain_model_from_csv(csv_path, model_output_path):
    import pandas as pd
    import xgboost as xgb
    import pickle
    from sklearn.model_selection import train_test_split

    data = pd.read_csv(csv_path)
    X = data.iloc[:, :-1]
    y = data.iloc[:, -1]

    X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

    model = xgb.XGBClassifier(
        n_estimators=100,
        learning_rate=0.1,
        max_depth=5,
        random_state=42,
        use_label_encoder=False,
        eval_metric='logloss'
    )

    model.fit(X_train, y_train, eval_set=[(X_val, y_val)],  verbose=False)

    with open(model_output_path, "wb") as f:
        pickle.dump(model, f)

    return f"Model retrained and saved at: {model_output_path}"
