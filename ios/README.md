# Quiz Break Kids — 앱 잠금(Screen Time) 모듈

Brainrot / BibleScroll 같은 앱이 쓰는 **iOS Screen Time API** 로
"퀴즈를 맞혀야 앱이 열리는" 구조를 구현한 소스입니다.

## 동작 방식

```
부모가 앱(유튜브 등) 고르고 → 나이·과목·간격 정하고 → [실행]
        ↓
        앱을 닫아도 됨. iOS 가 대신 사용 시간을 잰다
        ↓
아이가 유튜브를 봄 … 사용 시간이 간격(예: 20분)만큼 쌓임
        ↓
eventDidReachThreshold 가 본체 앱 없이 깨어나 차단을 건다
        ↓
아이 화면: 유튜브가 덮이고 "퀴즈 시간이에요!" 차단 화면
        ↓
[퀴즈 풀기] → 알림 → 탭 → 나이·과목에 맞는 문제
        ↓
다 맞히면 잠금 해제. 다음 20분 사용이 쌓이면 또 나타난다
```

### iOS 에서 되는 것과 안 되는 것

**안 되는 것 — 유튜브 위에 팝업 띄우기.** iOS 에는 다른 앱 위에
창을 그리는 API 가 없습니다(안드로이드의 SYSTEM_ALERT_WINDOW 에
해당하는 것이 없음). 아무리 고쳐도 작동하지 않습니다.

**안 되는 것 — 백그라운드 타이머.** 앱이 내려가면 코드가 멈추므로
"앱을 닫아도 N분마다" 를 앱 자신의 타이머로는 만들 수 없습니다.

**되는 것 — Screen Time 차단.** iOS 가 사용 시간을 대신 재고,
간격이 차면 앱 대신 차단 화면을 덮습니다. 본체 앱이 꺼져 있어도
익스텐션이 깨어납니다. 아이가 보는 결과는 "유튜브 보다가 갑자기
퀴즈가 나타남" 으로 같습니다.

**벽시계가 아니라 사용 시간입니다.** 20분으로 두면 유튜브를 실제로
20분 봤을 때 울립니다. 앱을 안 쓰는 동안은 시간이 흐르지 않으므로
아이가 다른 일을 하는 중에 엉뚱하게 뜨지 않습니다.

## 파일

| 경로 | 들어갈 타깃 |
|---|---|
| `Shared/QuizBreakShared.swift` | 본체 + 익스텐션 3개 **전부** |
| `App/ShieldController.swift` | 본체 + MonitorExtension |
| `App/AuthorizationManager.swift` | 본체 |
| `App/ParentSettingsView.swift` | 본체 |
| `App/DesignSystem.swift` | 본체 — 색·카드·스탯 타일·진행률 링·마스코트 |
| `App/QuizEngine.swift` | 본체 — 점수·콤보·스트릭·과목별 기록 |
| `App/QuestionBank.swift` | 본체 — 문제 공급 (Questions.json 있으면 그걸 씀) |
| `App/RootTabView.swift` | 본체 — 하단 탭 + 딥링크 수신 |
| `App/HomeView.swift` | 본체 |
| `App/QuizGameView.swift` | 본체 |
| `App/StatsView.swift` | 본체 |
| `MonitorExtension/…` | Device Activity Monitor Extension |
| `ShieldConfigurationExtension/…` | Shield Configuration Extension |
| `ShieldActionExtension/…` | Shield Action Extension |

## 설치 순서

### 1. 익스텐션 타깃 3개 추가

Xcode → File → New → Target 에서 각각 추가합니다. 템플릿이
`Info.plist` 의 `NSExtensionPointIdentifier` 를 알아서 넣어줍니다.

- **Device Activity Monitor Extension**
- **Shield Configuration Extension**
- **Shield Action Extension**

### 2. Capability 추가

본체 앱과 익스텐션 3개 **모두** 에 똑같이:

- **App Groups** → `group.com.ojlstudio.quizbreakkids`
  (`QuizBreakShared.swift` 의 `appGroupID` 와 반드시 일치)
- **Family Controls**

본체 앱에만 추가:

- **Push Notifications** (차단 화면에서 퀴즈로 넘기는 알림용)

### 3. URL 스킴 등록

본체 앱 `Info.plist` → URL Types 에 `quizbreak` 추가.
알림을 탭했을 때 `quizbreak://quiz` 로 퀴즈 화면이 열립니다.

### 4. Target Membership 확인

`QuizBreakShared.swift` 가 네 타깃 모두에 체크되어 있어야 합니다.
빠지면 익스텐션 빌드가 "Cannot find 'QuizBreak' in scope" 로 깨집니다.

## 알아둘 제약

**시뮬레이터에서 동작하지 않습니다.** 실기기에서만 테스트됩니다.

**임계값은 한 번 울리면 끝입니다.** 그래서 퀴즈를 맞힐 때마다
`armIntervalWatch()` 로 다음 판을 다시 겁니다 (`unlockForQuizReward()` 안).

**Family Controls 배포 권한이 필요합니다.** 개발 중에는 Capability 만
추가해도 실기기 테스트가 되지만, TestFlight·App Store 배포에는
Apple 승인이 필요합니다.

**익스텐션에서 본체 앱을 직접 열 수 없습니다.** `ShieldActionResponse`
는 `.close` / `.defer` / `.none` 뿐입니다. 그래서 알림을 거쳐서
퀴즈 화면으로 보냅니다.

## 화면 구성

```
RootTabView                하단 탭 + 딥링크 수신
├── HomeView               마스코트 · 오늘 진행률 링 · 스탯 타일 · 약한 과목
├── StatsView              과목별 기록 · 하루 목표
└── ParentSettingsView     권한 · 차단할 앱 · 보상 시간

QuizGameView               진행 바 · 점수 · 연속 정답 · 콤보 배경
                           차단 화면에서 넘어왔을 때만 열린다
```

홈에 "퀴즈 풀기" 버튼은 두지 않았습니다. 퀴즈는 아이가 찾아가는 게
아니라 사용 시간이 차면 찾아오는 것이라서, 수동 진입점이 있으면
설계가 흐려집니다. 홈은 오늘 진행률만 보여줍니다.

점수는 연속 정답에 따라 10 / 15 / 20 / 30 점으로 오릅니다 (`QuizEngine.points(forCombo:)`).
하루 목표를 채우면 스트릭이 하루 올라가고, 하루를 건너뛰면 끊깁니다.

마스코트(`Mascot`)는 SF Symbol 로 자리만 잡아둔 임시입니다.
실제 아트가 나오면 Assets 에 `Mascot` 으로 넣고 `Image("Mascot")` 으로 바꾸세요.

## 본체 앱에서 이어붙일 곳

`RootTabView` 가 딥링크 수신과 만료 회수를 이미 들고 있으니,
App 진입점에서 그것만 띄우면 됩니다.

```swift
@main
struct QuizBreakKidsApp: App {
    var body: some Scene {
        WindowGroup { RootTabView() }
    }
}
```
