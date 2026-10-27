# Quiz Break Kids — 앱 잠금(Screen Time) 모듈

Brainrot / BibleScroll 같은 앱이 쓰는 **iOS Screen Time API** 로
"퀴즈를 맞혀야 앱이 열리는" 구조를 구현한 소스입니다.

## 동작 방식

```
부모가 막을 앱 선택
        ↓
ManagedSettings 로 차단 적용
        ↓
아이가 그 앱을 염  →  iOS 가 차단 화면을 덮음
        ↓
"퀴즈 풀기" 버튼  →  ShieldAction 익스텐션이 알림 발송
        ↓
알림 탭  →  퀴즈 화면  →  정답
        ↓
차단 해제 + N분 뒤 재잠금 예약
        ↓
DeviceActivityMonitor 가 깨어나 다시 차단
```

**중요:** iOS 에는 실행 중인 다른 앱을 강제 종료하는 API 가 없습니다.
이 구조는 앱을 종료시키는 게 아니라 **열리지 못하게 막습니다.**
사용자가 보는 결과는 같습니다.

## 파일

| 경로 | 들어갈 타깃 |
|---|---|
| `Shared/QuizBreakShared.swift` | 본체 + 익스텐션 3개 **전부** |
| `App/ShieldController.swift` | 본체 + MonitorExtension |
| `App/AuthorizationManager.swift` | 본체 |
| `App/ParentSettingsView.swift` | 본체 |
| `App/QuizGateView.swift` | 본체 |
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

**해제 시간 최소 15분.** `DeviceActivity` 는 15분보다 짧은 구간을
예약해 주지 않습니다. 더 짧게 열어주려면 예약에 기대지 말고
앱이 포그라운드로 올 때마다 `ShieldController.shared.reapplyIfExpired()`
를 불러서 직접 거둬들여야 합니다.

**Family Controls 배포 권한이 필요합니다.** 개발 중에는 Capability 만
추가해도 실기기 테스트가 되지만, TestFlight·App Store 배포에는
Apple 승인이 필요합니다.

**익스텐션에서 본체 앱을 직접 열 수 없습니다.** `ShieldActionResponse`
는 `.close` / `.defer` / `.none` 뿐입니다. 그래서 알림을 거쳐서
퀴즈 화면으로 보냅니다.

## 본체 앱에서 이어붙일 곳

```swift
// 알림 탭 → 퀴즈 화면
.onOpenURL { url in
    guard url == QuizBreak.quizDeepLink else { return }
    showQuiz = true
}

// 포그라운드 복귀 → 만료된 해제 거둬들이기
.onChange(of: scenePhase) { _, phase in
    if phase == .active {
        ShieldController.shared.reapplyIfExpired()
    }
}
```
