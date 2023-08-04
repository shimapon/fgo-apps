import os
import requests
from collections import defaultdict
from datetime import datetime, timedelta

# GitHubのtokenとリポジトリ情報を設定
token = os.getenv('MY_GITHUB_TOKEN')
headers = {'Authorization': f'token {token}'}
repo = "shimapon/fgo-apps"

# 週ごとのリード時間、PRの数、PRの作成者数、PRのアプルーバー数を集計する辞書
week_metrics = defaultdict(lambda: {
    'lead_times': [], 'creators': defaultdict(int), 'approvers': defaultdict(int)
})

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
    lead_time_hours = lead_time.total_seconds() / (60 * 60)  # 時間単位に変換

    # PRの作成者を集計
    creator = pull['user']['login']

    # PRのレビューを取得
    pull_number = pull['number']
    response = requests.get(f"https://api.github.com/repos/{repo}/pulls/{pull_number}/reviews", headers=headers)
    reviews = response.json()

    approvers = []
    for review in reviews:
        # レビューが承認されていれば、アプルーバーを集計
        if review['state'] == 'APPROVED':
            approver = review['user']['login']
            approvers.append(approver)

    # PRを適切な週に割り当て
    week = (created_at - datetime.now()).days // 7
    week_metrics[week]['lead_times'].append(lead_time_hours)
    week_metrics[week]['creators'][creator] += 1
    for approver in set(approvers):  # 同一PR内での重複アプルーバーを避ける
        week_metrics[week]['approvers'][approver] += 1

# レポートを作成
with open('results.txt', 'w') as f:
    for week, metrics in sorted(week_metrics.items()):
        average_lead_time = sum(metrics['lead_times']) / len(metrics['lead_times'])
        number_of_prs = len(metrics['lead_times'])
        number_of_creators = len(metrics['creators'])
        number_of_approvers = len(metrics['approvers'])

        f.write(f"Week {week}:\n")
        f.write(f"Average lead time: {average_lead_time} hours\n")
        f.write(f"Number of PRs: {number_of_prs}\n")
        f.write(f"Number of creators: {number_of_creators}\n")
        f.write(f"Number of approvers: {number_of_approvers}\n")
        f.write("\n")
