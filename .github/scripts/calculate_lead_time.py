import os
import requests
from datetime import datetime, timedelta

# GitHubのtokenとリポジトリ情報を設定
token = os.getenv('MY_GITHUB_TOKEN')
headers = {'Authorization': f'token {token}'}
repo = "shimapon/fgo-apps"

# APIからデータを取得
response = requests.get(f"https://api.github.com/repos/{repo}/pulls?state=closed", headers=headers)
pulls = response.json()

# PRのリード時間を計算
lead_times = []
for pull in pulls:
    created_at = datetime.strptime(pull['created_at'], '%Y-%m-%dT%H:%M:%SZ')
    closed_at = datetime.strptime(pull['closed_at'], '%Y-%m-%dT%H:%M:%SZ')
    lead_time = closed_at - created_at
    lead_times.append(lead_time.total_seconds() / (60 * 60 * 24))  # 日単位に変換

# 平均リード時間を計算
if lead_times:
    average_lead_time = sum(lead_times) / len(lead_times)
    with open('results.txt', 'w') as f:
        f.write(f"Average lead time: {average_lead_time} days\n")
else:
    with open('results.txt', 'w') as f:
        f.write("No closed PRs found.\n")