from pickle import TRUE
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from bs4 import BeautifulSoup as bs
from webdriver_manager.chrome import ChromeDriverManager
driver = webdriver.Chrome(ChromeDriverManager().install())
options = Options()
options.page_load_strategy = 'normal'
options.add_argument('--enable-automation')
options.headless = True
options.add_argument("window-size=1920,1080")
options.add_argument("--no-sandbox")
options.add_argument('disable-infobars')
options.add_argument("--disable-extensions")
options.add_argument("--dns-prefetch-disable")
options.add_argument("--disable-gpu")
options.add_experimental_option("excludeSwitches", ["enable-automation"])
options.add_experimental_option('useAutomationExtension', False)
# WebDriverWait(driver, 30).until(EC.frame_to_be_available_and_switch_to_it((By.CSS_SELECTOR,"iframe#whovaIframeSpeaker")))

tags = ["array","dynamic-programming","string","math","hash-table","linked-list","two-pointers","binary-search","depth-first-search","greedy","graph","binary-tree","stack","bit-manipulation","backtracking","recursion","game-theory","union-find","counting","combinatorics","geometry","heap-priority-queue","sliding-window","probability-and-statistics"]
cnt=0
urls=[]
titles = []
all_ques=[]
for tag_name in tags:
    link = "https://leetcode.com/tag/"+tag_name
    driver.get(link)
    time.sleep(10)
    html = driver.page_source
    soup = bs(html,'html.parser')
    all_ques_div = soup.findAll("div", {"class": "title-cell__ZGos"})
    
    for ques in all_ques_div:
        # print(ques)
        if not ques.find("span"):
            if ques.find("a") not in all_ques:
                all_ques.append(ques.find("a"))
# print(len(all_ques))
    
for ques in all_ques:
    urls.append("https://leetcode.com"+ques['href'])
    titles.append(ques.text)
with open("leetcode_prob_url.txt","w+") as f:
    f.write('\n'.join(urls))
with open("leetcode_prob_titles.txt","w+") as f:
    f.write('\n'.join(titles))

    
for url in urls:
    driver.get(url)
    cnt+=1
    
    time.sleep(5)
    html = driver.page_source
    soup = bs(html,'html.parser')
    problem_text =  soup.find('div', {"class": "content__u3I1 question-content__JfgR"}).get_text()
    
    # print(problem_text)
    with open("leet_prob"+str(cnt)+".txt", "w+",encoding="utf-8") as f:
        f.write((problem_text))
