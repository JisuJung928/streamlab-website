# STREAM Lab 웹사이트 업데이트 가이드

사이트는 크게 두 종류의 파일로 구성되어 있습니다.

- **데이터 파일** (`publication-data.js`, `news-data.js`): 논문·뉴스 "내용"이 들어있는 파일. 여기만 수정하면 관련된 모든 페이지(Index, Publication, News)에 자동으로 반영됩니다.
- **화면 파일** (`Index.dc.html`, `Publication.dc.html`, `News.dc.html` 등): 레이아웃/디자인. 텍스트나 사진은 화면에서 직접 클릭해서 바로 수정할 수도 있습니다 (편집 모드).

대부분의 업데이트(논문 추가, 뉴스 추가, 사진 교체)는 **데이터 파일만 고치면 됩니다.**

---

## 1. 논문 추가/수정 — `publication-data.js`

`PUBLICATIONS` 배열에 연도별로 논문이 들어있습니다. 새 논문은 해당 연도 그룹의 `items` 배열에 한 줄 추가하면 됩니다.

```js
{ photoId: 'pub-my-new-paper', fields: ['Machine learning potential'], title: '논문 제목', authors: 'Kim, A., **Jung, J.**, Lee, B.*', venue: 'Journal Name 12, 345', doi: '10.xxxx/xxxxx' },
```

각 항목의 의미:
- `photoId`: 그 논문의 사진(피규어)을 저장할 고유 이름. 아무 문자열이나 가능하지만 한번 정하면 바꾸지 마세요.
- `fields`: 연구 분야 태그. 아래 4개 중 골라서 배열로 넣습니다 — `'First-principles calculation'`, `'Machine learning potential'`, `'Multi-scale simulation'`, `'Generative AI for materials'`.
- `title`: 논문 제목.
- `authors`: 저자 목록. 강조하고 싶은 이름은 `**이름**`처럼 별표 2개로 감싸면 굵게 표시됩니다 (보통 소속 연구실 PI 이름).
- `venue`: 저널/권/페이지 정보.
- `doi`: DOI 번호만 입력 (예: `10.1021/xxxx`). 있으면 "View paper ↗" 링크가 자동 생성됩니다. 없으면 빈 문자열 `''`.

**새 연도를 추가하려면** 배열 맨 앞에 새 그룹을 추가하세요:

```js
{ year: '2027', items: [ /* 논문들 */ ] },
```

**사진 넣는 법**: 코드에서는 `photoId`만 정하면 되고, 실제 이미지는 웹사이트 화면(Publication 페이지)에서 해당 자리에 이미지를 드래그 앤 드롭하면 됩니다. 한 번 넣으면 같은 `photoId`를 쓰는 Index 페이지의 미리보기에도 자동으로 같이 나타납니다.

---

## 2. 뉴스 추가/수정 — `news-data.js`

`NEWS_ITEMS` 배열 맨 앞에 새 항목을 추가하면 최신 뉴스로 표시됩니다 (Index 페이지에는 최근 3개만 보여짐).

```js
{ id: 'my-news-2026', date: '2026.07.10', title: '제목', excerpt: '본문 요약', imageId: 'news-my-news-2026' },
```

- `id`: 고유 식별자 (영문/숫자, 공백 없이).
- `date`: `YYYY.MM.DD` 형식.
- `title`, `excerpt`: 제목과 본문 요약.
- `imageId`: 사진을 붙이고 싶을 때만 지정 (없으면 사진 없이 텍스트만 표시됨). `photoId`와 마찬가지로 News 페이지에서 드래그 앤 드롭으로 사진을 넣습니다.
- `link`: (선택) 관련 외부 링크가 있으면 URL을 넣으면 미리보기 카드가 자동 생성됩니다.

---

## 3. 화면에서 직접 고칠 수 있는 것들

다음은 데이터 파일을 건드리지 않고 웹페이지 화면에서 바로 클릭해서 고칠 수 있습니다:
- 홈(Index) 상단 문구, 소개 문단, 버튼 텍스트
- 각 페이지의 제목/설명 텍스트
- 색상 하나만 바꾸고 싶은 경우

논문/뉴스 목록처럼 **여러 페이지에 반복되는 데이터**는 반드시 데이터 파일(`publication-data.js`, `news-data.js`)에서 고쳐야 모든 페이지가 함께 업데이트됩니다.

---

## 4. 확신이 안 서면

수정하고 싶은 내용을 Markdown이나 텍스트로 정리해서 전달해 주시면, 해당 데이터 파일이나 화면 파일에 반영해 드리겠습니다.
