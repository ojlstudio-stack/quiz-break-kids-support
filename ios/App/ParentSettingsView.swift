import SwiftUI
import FamilyControls

/// 부모용 설정 화면. 권한을 받고, 막을 앱을 고르고, 보상 시간을 정한다.
public struct ParentSettingsView: View {

    @StateObject private var auth = AuthorizationManager()

    @State private var selection = FamilyActivitySelection()
    @State private var showPicker = false
    @State private var unlockMinutes = SharedStore.unlockMinutes
    @State private var shieldOn = SharedStore.loadSelection() != nil

    public init() {}

    public var body: some View {
        NavigationStack {
            Form {
                authorizationSection

                if auth.isApproved {
                    targetSection
                    rewardSection
                    switchSection
                }
            }
            .navigationTitle("퀴즈 잠금 설정")
            .familyActivityPicker(isPresented: $showPicker, selection: $selection)
            .onChange(of: selection) { _, newValue in
                SharedStore.saveSelection(newValue)
                if shieldOn { ShieldController.shared.applyShield() }
            }
            .task {
                if let saved = SharedStore.loadSelection() { selection = saved }
            }
        }
    }

    private var authorizationSection: some View {
        Section("스크린타임 권한") {
            switch auth.status {
            case .approved:
                Label("허용됨", systemImage: "checkmark.circle.fill")
                    .foregroundStyle(.green)
            case .denied:
                Label("거부됨", systemImage: "xmark.circle.fill")
                    .foregroundStyle(.red)
                Text("설정 > 스크린타임에서 다시 허용해 주세요.")
                    .font(.footnote)
                    .foregroundStyle(.secondary)
            case .notDetermined:
                Button("권한 요청하기") {
                    Task { await auth.requestAuthorization() }
                }
            @unknown default:
                Text("알 수 없는 상태")
            }

            if let error = auth.lastError {
                Text(error)
                    .font(.footnote)
                    .foregroundStyle(.red)
            }
        }
    }

    private var targetSection: some View {
        Section("퀴즈로 잠글 앱") {
            Button {
                showPicker = true
            } label: {
                HStack {
                    Text("앱 고르기")
                    Spacer()
                    Text(selectionSummary)
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    private var rewardSection: some View {
        Section {
            Picker("열어줄 시간", selection: $unlockMinutes) {
                ForEach([15, 20, 30, 45, 60], id: \.self) { minutes in
                    Text("\(minutes)분").tag(minutes)
                }
            }
            .onChange(of: unlockMinutes) { _, newValue in
                SharedStore.unlockMinutes = newValue
            }
        } header: {
            Text("퀴즈를 맞혔을 때")
        } footer: {
            Text("iOS가 15분보다 짧은 구간은 예약해 주지 않아서 최소 15분입니다.")
        }
    }

    private var switchSection: some View {
        Section {
            Toggle("퀴즈 잠금 켜기", isOn: $shieldOn)
                .onChange(of: shieldOn) { _, isOn in
                    if isOn {
                        ShieldController.shared.applyShield()
                    } else {
                        ShieldController.shared.clearShield()
                    }
                }
        }
    }

    private var selectionSummary: String {
        let apps = selection.applicationTokens.count
        let categories = selection.categoryTokens.count
        if apps == 0 && categories == 0 { return "없음" }
        var parts: [String] = []
        if apps > 0 { parts.append("앱 \(apps)개") }
        if categories > 0 { parts.append("카테고리 \(categories)개") }
        return parts.joined(separator: ", ")
    }
}
