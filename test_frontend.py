import sys
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Check Main Index
        page.goto('http://localhost:8000/news/')
        page.wait_for_selector('.article-card', timeout=5000)

        content = page.content()
        if 'BOJ, 엔화 약세와 임금 인상발 인플레 압력 주시…금리 경로 조정 가능성' not in content:
            print('Error: First new article not found on the main index.')
            sys.exit(1)
        if '연준 인하 기대 후퇴 속 미 증시 변동성 확대…성장주 밸류에이션 부담' not in content:
            print('Error: Second new article not found on the main index.')
            sys.exit(1)
        if '국제 유가 불안에 국내 기름값 오름세…생활 물가 체감 부담 가중' not in content:
            print('Error: Third new article not found on the main index.')
            sys.exit(1)

        print("Main index rendered successfully with the new articles.")

        # Check financial index
        page.goto('http://localhost:8000/news/financial/')
        page.wait_for_selector('.news-card', timeout=5000)
        if 'BOJ, 엔화 약세와 임금 인상발 인플레 압력 주시…금리 경로 조정 가능성' not in page.content():
            print("Error: Article missing from financial index.")
            sys.exit(1)

        print("Financial index updated successfully.")

        # Check stock index
        page.goto('http://localhost:8000/news/stock/')
        page.wait_for_selector('.card', timeout=5000)
        if '연준 인하 기대 후퇴 속 미 증시 변동성 확대…성장주 밸류에이션 부담' not in page.content():
            print("Error: Article missing from stock index.")
            sys.exit(1)

        print("Stock index updated successfully.")

        # Check money index
        page.goto('http://localhost:8000/news/money/')
        page.wait_for_selector('.card', timeout=5000)
        if '국제 유가 불안에 국내 기름값 오름세…생활 물가 체감 부담 가중' not in page.content():
            print("Error: Article missing from money index.")
            sys.exit(1)

        print("Money index updated successfully.")

        browser.close()

if __name__ == '__main__':
    run()
