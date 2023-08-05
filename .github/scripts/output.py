import pandas as pd

def write_to_html(all_daily_data, all_weekly_data):
    df_daily = pd.DataFrame(all_daily_data)
    df_weekly = pd.DataFrame(all_weekly_data)
    with open('results.html', 'w') as f:
        f.write("<h2>Daily Data</h2>")
        f.write(df_daily.to_html(index=False))
        f.write("<h2>Weekly Data</h2>")
        f.write(df_weekly.to_html(index=False))
