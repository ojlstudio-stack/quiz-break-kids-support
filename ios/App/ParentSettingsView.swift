import SwiftUI
import FamilyControls

/// 부모용 설정. 권한 → 막을 앱 → 연령·과목 → 간격 → 실행/중지.
public struct ParentSettingsView: View {

    @StateObject private var auth = AuthorizationManager()

    @State private var selection = FamilyActivitySelection()
    @State private var showPicker = false

    @State private var ageGroup = SharedStore.ageGroup
    @State private var subjectIDs = SharedStore.subjectIDs
    @State private var intervalMinutes = SharedStore.intervalMinutes
    @State private var running = SharedStore.scheduleEnabled

    public init() {}

    public var body: some View {
        NavigationStack {
            Form {
                authorizationSection

                if auth.isApproved {
                    targetSection
                    ageSection
                    subjectSection
                    intervalSection
                    runSection
                }
            }
            .navigationTitle("퀴즈 잠금")
            .familyActivityPicker(isPresented: $showPicker, selection: $selection)
            .onChange(of: selection) { _, newValue in
                SharedStore.saveSelection(newValue)
                if running { ShieldController.shared.armIntervalWatch() }
            }
            .task {
                if let saved = SharedStore.loadSelection() { selection = saved }
            }
        }
    }

    // MARK: 권한

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
                Text(error).font(.footnote).foregroundStyle(.red)
            }
        }
    }

    // MARK: 대상 앱

    private var targetSection: some View {
        Section {
            Button {
                showPicker = true
            } label: {
                HStack {
                    Text("앱 고르기")
                    Spacer()
                    Text(selectionSummary).foregroundStyle(.secondary)
                }
            }
        } header: {
            Text("퀴즈가 끼어들 앱")
        } footer: {
            Text("유튜브처럼 아이가 오래 보는 앱을 고르세요.")
        }
    }

    // MARK: 문제 조건

    private var ageSection: some View {
        Section("아이 나이") {
            Picker("나이", selection: $ageGroup) {
                ForEach(AgeGroup.allCases) { group in
                    Text(group.label).tag(group)
                }
            }
            .pickerStyle(.segmented)
            .onChange(of: ageGroup) { _, newValue in
                SharedStore.ageGroup = newValue
            }
        }
    }

    private var subjectSection: some View {
        Section {
            ForEach(Subject.all) { subject in
                Button {
                    toggle(subject)
                } label: {
                    HStack {
                        Image(systemName: subject.symbol)
                            .foregroundStyle(.tint)
                            .frame(width: 26)
                        Text(subject.name)
                            .foregroundStyle(.primary)
                        Spacer()
                        if subjectIDs.contains(subject.id) {
                            Image(systemName: "checkmark")
                                .foregroundStyle(.tint)
                        }
                    }
                }
            }
        } header: {
            Text("출제 과목")
        } footer: {
            Text(subjectIDs.isEmpty ? "아무것도 고르지 않으면 전 과목에서 나옵니다." : "")
        }
    }

    // MARK: 간격

    private var intervalSection: some View {
        Section {
            Picker("간격", selection: $intervalMinutes) {
                ForEach([10, 15, 20, 30, 45, 60], id: \.self) { minutes in
                    Text("\(minutes)분").tag(minutes)
                }
            }
            .onChange(of: intervalMinutes) { _, newValue in
                SharedStore.intervalMinutes = newValue
                if running { ShieldController.shared.armIntervalWatch() }
            }
        } header: {
            Text("얼마나 보면 퀴즈가 나타날까요")
        } footer: {
            Text("고른 앱을 이만큼 **실제로 사용하면** 퀴즈가 끼어듭니다. 앱을 쓰지 않는 동안은 시간이 흐르지 않습니다.")
        }
    }

    // MARK: 실행 / 중지

    private var runSection: some View {
        Section {
            if running {
                Button(role: .destructive) {
                    stop()
                } label: {
                    Label("중지", systemImage: "stop.fill")
                }
            } else {
                Button {
                    start()
                } label: {
                    Label("실행", systemImage: "play.fill")
                }
                .disabled(selection.applicationTokens.isEmpty && selection.categoryTokens.isEmpty)
            }
        } header: {
            Text(running ? "작동 중" : "꺼짐")
        } footer: {
            Text(running
                 ? "이제 앱을 닫으셔도 됩니다. 아이가 고른 앱을 \(intervalMinutes)분 사용하면 퀴즈가 나타납니다."
                 : "실행을 누르고 앱을 닫으시면 됩니다. 앱이 꺼져 있어도 작동합니다.")
        }
    }

    // MARK: -

    private func start() {
        ShieldController.shared.startWatching()
        running = true
    }

    private func stop() {
        ShieldController.shared.stopEverything()
        running = false
    }

    private func toggle(_ subject: Subject) {
        if subjectIDs.contains(subject.id) {
            subjectIDs.remove(subject.id)
        } else {
            subjectIDs.insert(subject.id)
        }
        SharedStore.subjectIDs = subjectIDs
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
