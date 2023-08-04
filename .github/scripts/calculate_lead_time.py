import os
import requests
from collections import defaultdict
from datetime import datetime, timedelta

# GitHubのtokenとリポジトリ情報を設定
token = os.getenv('MY_GITHUB_TOKEN')
headers = {'Authorization': f'token {token}'}
repo = "shimapon/fgo-apps"

# PRのリード時間を計算
lead_times = []

# PRの作成者とアプルーバーの数を集計する辞書
creator_counts = defaultdict(int)
approver_counts = defaultdict(int)

# APIからデータを取得
page = 1
pulls = []
while True:
    response = requests.get(
        f"https://api.github.com/repos/{repo}/pulls?state=closed&page={page}&per_page=100", 
        headers=headers
    )
    data = response.json()
    if not data:
        break
    pulls.extend(data)
    page += 1

for pull in pulls:
    # 'base'ブランチが'develop'でなければスキップ
    if pull['base']['ref'] != 'develop':
        continue

    closed_at = datetime.strptime(pull['closed_at'], '%Y-%m-%dT%H:%M:%SZ')

    # 過去3ヶ月以内のPRだけを考慮
    if closed_at < datetime.now() - timedelta(days=90):
        continue

    # PRのリード時間を計算
    created_at = datetime.strptime(pull['created_at'], '%Y-%m-%dT%H:%M:%SZ')
    lead_time = closed_at - created_at
    lead_times.append(lead_time.total_seconds() / (60 * 60))  # 時間単位に変換

    # PRの作成者を集計
    creator = pull['user']['login']
    creator_counts[creator] += 1

    # PRのレビューを取得
    pull_number = pull['number']
    response = requests.get(f"https://api.github.com/repos/{repo}/pulls/{pull_number}/reviews", headers=headers)
    reviews = response.json()

    for review in reviews:
        # レビューが承認されていれば、アプルーバーを集計
        if review['state'] == 'APPROVED':
            approver = review['user']['login']
            approver_counts[approver] += 1

# 平均リード時間を計算
average_lead_time = sum(lead_times) / len(lead_times)

# レポートを作成
with open('results.txt', 'w') as f:
    f.write(f"Average lead time: {average_lead_time} hours\n")
    f.write(f"Number of PRs: {len(lead_times)}\n")  # ここは `pulls` の長さではなく、 `lead_times` の長さを使用

    f.write("\nPR creators:\n")
    for creator, count in creator_counts.items():
        f.write(f"{creator}: {count} PRs\n")

    f.write("\nPR approvers:\n")
    for approver, count in approver_counts.items():
        f.write(f"{approver}: {count} approvals\n")
