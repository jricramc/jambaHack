# api/app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
sys.path.append('..')  # Add the parent directory to the Python path
from FinRobot.app_function import single_agent_analysis
from FinRobot.research_agent import research_company
from FinRobot.risk_agent import perform_risk_analysis

app = Flask(__name__)
# CORS(app)
CORS(app, resources={r"/*": {"origins": ["http://localhost:3000"]}})

@app.route('/api/market-analysis', methods=['POST'])
def market_analysis():

    company = request.json.get('company', 'Tesla')  # Default to 'Apple' if not provided
    analysis = single_agent_analysis(company)
    return jsonify({'analysis': analysis})

@app.route('/api/risk-analysis', methods=['POST'])
def risk_analysis():

    company = request.json.get('company', 'Tesla')  # Default to 'Apple' if not provided
    analysis = perform_risk_analysis(company)
    return jsonify({'analysis': analysis})

@app.route('/api/research-agent', methods=['POST'])
def research_analysis():

    company = request.json.get('company', 'Tesla')  # Default to 'Apple' if not provided
    analysis = research_company(company)
    return jsonify({'analysis': analysis})

    



@app.route('/healthcheck', methods = ['GET'])
def health_check():
    return jsonify('healthy')



if __name__ == '__main__':
    app.run(debug=True)