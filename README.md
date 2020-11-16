# **GITLAB 설정하기**

---

## GitLab 환경 세팅(웹 버전)

1. [SSG GitLab 접속](https://gitlab.ssgadm.com) → 로그인 (ID 및 PW 초기값은 젠킨스와 동일)
2. 우측 최상단 아이콘 클릭 → Settings → 좌측 메뉴 중 Profile → Main settings 의 Email 복사
3. 이클립스 → Window → Preferences → Team → Git → Configuration → Add Entry 버튼 클릭 <br> → Key 란에 user.email Value 란에 2에서 복사한 내용 붙여넣기 후 Add → Add Entry 버튼 클릭
  → Key 란에 user.name Value 란에 사번 기입 후 Add → Apply
4. 이클립스 → Window → Preferences → General → Network Connections → SSH2 <br> → 탭 메뉴 중 Key Management → Generate RSA Key 버튼 클릭 → 우측 하단 Save Private Key → OK 저장 OK
5. C:\Users\user\.ssh 폴더 이동 → id_rsa.pub 파일 내용 복사 → SSG GitLab 접속 후 2의 Settings 까지 진행 <br> → 좌측 메뉴 중 SSH Keys → Key 란에 붙여넣기 및 Title 란에 임의로 기입 후 Add keys 
6. 상단 메뉴 중 Projects → Your projects → 연동하고픈 프로젝트 클릭 (크롤링의 경우 'crawler / ssg-crawler') <br> → 우측 상단에 청색 'Clone'버튼 → Clone with SSH 아래 URI 복사
7. 이클립스 → Window → Show View → Other → 검색창에 git 입력 후 Git Repositories 선택 및 OK 
8. Git Repositories 창의 'Clone a Git repository' 클릭 → URI 란에 6의 복사본 붙여넣기 및 Protocol 란에 'SSH' 선택 후 Next <br> → YES YES → master 브랜치 체크 후 Next 
9. **Directory 란에 원하는 Local Repository 및 이클립스 프로젝트 경로를 기입** <br> → 'Import all existing Eclipse projects after clone finishies' 체크 후 Finish 클릭
10. Project 관련 View에 해당 프로젝트가 등록된 것을 확인.

---

# **GitLab 기능 사용**

## 준비사항

* Git Staging창과 History창 열어두기.
* Git Staging : Window → Show View → Other... → Git → Git Staging
* History : Window → Show View → Other... → Team → History (프로젝트 우클릭 → Team → Show in History)

## commit

* commit : Local Repository에 저장하는 기능으로 Remote Repository와 별개. 대신 svn의 commit은 git의 commit+push 기능과 비슷하다. 

1. 프로젝트에 변경사항이 생기면 Git Staging 창의 Unstaged Change 란에 알아서 추가된 것을 확인.
2. commit 하고픈 파일을 해당 창의 우측상단에 녹십자 버튼을 통해 Staged Change 란으로 옮긴다.
3. Commit Message 기입 후  우측 하단의 Commit 버튼 클릭. (바로 원격저장소로의 push를 원하는 경우 commit+push)

## push(1) - 로컬저장소가 최신인 경우(변경사항을 원격저장소 전송 후 공유하겠다는 의미)

* History 창에서 push대상 commit을 볼 수 있음.
* origin/master는 원격저장소의 최신 commit을 가리킴
* master|HEAD는 로컬저장소의 최신 commit을 가리킴

1. push대상 커밋 우클릭 후 Push Commit... 클릭
2. "Configure upstream for push and pull" 체크 후 "When pulling"을 "Rebase"로 변경후 Next 클릭
- merge		: 변경 내용의 이력이 모두 그대로 남아 있어 이력이 복잡해진다. <br> (ex| 토픽 브랜치에 통합 브랜치의 최신 코드를 적용할 때는 rebase)
- rebase	: 이력은 단순해지지만, 원래 커밋 이력이 변경된다. 정확한 이력을 남길 필요가 있을 때는 지양.<br> (ex|통합 브랜치에 토픽 브랜치를 불러올 경우에는 rebase 후 merge)
3. Finish → OK

## push(2) - 로컬저장소가 원격저장소와 비교시 최신이 아닐 때, 로컬의 모든 파일이 commit된 상태인 경우

1. 프로젝트 우클릭 → Team → Pull (Pull 없이 Push Commit... 시 push가 reject.)
2. 충돌없이 정상적으로 pull된 경우  'Result OK'가 표시됨 <br> 충돌이 발생한 경우에는 충돌 해결(충돌 해결 절차는 https://wiki.eclipse.org/EGit/User_Guide#Resolving_a_merge_conflict 를 참고한다.)
3. 이후의 과정은 "push 하기1"과 동일

## push(3) - 로컬저장소가 원격저장소와 비교시 최신이 아닐 때, commit 하지 않은 변경사항이 있는 경우

commit할 내용이 있으면서 아래와 같이 Unstaged Changes나 Staged Changed에 파일이 있는 경우를 얘기함
1. 프로젝트 우클릭 → Team → Pull 클릭 (Push Commit... 클릭시 "push(2)"와 같이 push가 reject 됨)
2. commit하지 않은 파일들을 어떻게 처리할지 선택하라는 창이 표시됨
3. Stash... 클릭 (stash는 임시저장의 의미) 필요한 경우, stash 메시지 입력(메시지 입력은 옵션)
4. OK 클릭
5. pull이 정상적으로 수행되며 이후 commit 절차는 "push(1)"과 동일.
6. push가 완료된 이후에는 Stash 된 내용으로 복구.
-. Git Repositories에서 복구할 stash를 선택한 후 "Apply Stashed Changes" 클릭
7. stash 완료 후 stash가 필요없다고 판단되면 삭제한다.

# pull
1. Project 관련 View에서 해당 프로젝트 또는 파일 우클릭 → Team → Repository → pull 
 
* File 추가/삭제/변경시 모든 내용은 Git Staging Console창의 Unstaged Changed에 표시됨.
* Unstaged Changed에서 커밋대상 파일을 선택 후 "Add to Index" 클릭

# 소스 동기화 확인
1. 대상 파일의 상위폴더 우클릭 → Team → Synchronize Workspace 클릭

## 기타 
* 한 파일 내에서도 부분 commit이 가능하다.
* PUSH 하기 전 commit은 수정이 가능하다.
* 파일명이 변경되어도 history 추적이 가능하다.
* remote repository와 비교하는거 찾음