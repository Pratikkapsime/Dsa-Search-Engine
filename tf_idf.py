from posixpath import split
import nltk
from nltk import tokenize
from operator import itemgetter
import math
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from numpy import log10 
stop_words = set(stopwords.words('english'))

prob_des =[]
all_key_words= []
# prob_des.append("the quick brown fox jumped over the lazy fox")
# prob_des.append("quick brown fox leap over lazy dog in summer")
# prob_des.append("the fox quickly jumped over the brid")
tf_matrix =[]
nt={}
total_doc=1737
#Creating global key word
for i in range (1,total_doc+1):
    with open("Corpus/leet_prob"+str(i)+".txt",encoding='utf8') as f:
        doc = f.read()
        doc = doc.lower()
        prob_des.append(doc)

    total_words = prob_des[i-1].split()
    for each_word in total_words:
        each_word = each_word.replace('.','')
        if each_word not in stop_words:
            if each_word not in all_key_words:
                all_key_words.append(each_word)
(all_key_words).sort()
# print(len(all_key_words))            
# tf_matrix.append(all_key_words)

for i in range (1,total_doc+1):
    # with open("leet_prob"+str(i)+".txt",encoding='utf8') as f:
    #     doc = f.read()
    #     doc = doc.lower()
    #     prob_des.append(doc)

    total_words = prob_des[i-1].split()
    
    tot_kwords_doc = 0

    tf_score = {}
    key_words=[]
    for each_word in total_words:
        each_word = each_word.replace('.','')
        
        if each_word not in stop_words:
            tot_kwords_doc+=1
            if each_word not in key_words:
                key_words.append(each_word)
            if each_word in tf_score:
                tf_score[each_word] += 1
            else:
                tf_score[each_word] = 1
    
    for ele in all_key_words:
        if ele in key_words:
            if ele in nt:
                nt[ele]+=1
            else:
                nt[ele]=1
        else:
            tf_score[ele]=0
    
    # Dividing by total_word_length for each dictionary element
    tf_score.update((x, y/int(tot_kwords_doc)) for x, y in tf_score.items())
    # print(tf_score)
    locallis=[]
    for x,y in tf_score.items():
        locallis.append([x,y])
    locallis.sort()
    # print(locallis)
    templis=[]
    for ele in locallis:
        templis.append(ele[1])
    tf_matrix.append(templis)

# print(tf_matrix)



idf_score = []
for each_word in all_key_words:
    val=log10(total_doc/nt[each_word])
    idf_score.append(val)
# print(idf_score)

for j in range(0,len(all_key_words)):
    for i in range(0,total_doc):
        tf_matrix[i][j]=str(round(tf_matrix[i][j]*idf_score[j],2))
        # print(tf_matrix[i][j])
# for i in range(0,total_doc):
#     with open("tf_idf_Matrix.txt", "a",encoding="utf-8") as f:
#             f.write(','.join(tf_matrix[i]))
#             f.write('\n')   
# with open("all_keywords.txt", "w+",encoding="utf-8") as f:
#         f.write('\n'.join(all_key_words))  
with open("idf_score.txt", "w+",encoding="utf-8") as f:
        f.write(','.join(str(idf_score))) 