/**
 * FitReward - Internationalization (Vietnamese / English)
 * Static markup is translated through data-i18n* attributes;
 * dynamic content calls t(key, params) directly.
 */

const LANG_STORAGE_KEY = 'fitRewardLang';
const SUPPORTED_LANGS = ['vi', 'en'];

const TRANSLATIONS = {
  vi: {
    'meta.title': 'FitReward - Nền tảng Health-to-Earn',
    'lang.label': 'Ngôn ngữ',

    // ---------------- Landing page ----------------
    'lp.nav.how': 'Cách hoạt động',
    'lp.nav.rewards': 'Phần thưởng',
    'lp.nav.security': 'Bảo mật',
    'lp.nav.pricing': 'Gói dịch vụ',
    'lp.nav.login': 'Đăng nhập',
    'lp.nav.start': 'Bắt đầu miễn phí',

    'lp.hero.badge': 'Health-to-Earn cho người trẻ đô thị Việt Nam',
    'lp.hero.title': 'Mỗi bước chân<br>đều có <span class="lp-accent">giá trị</span>',
    'lp.hero.desc': 'Biến thói quen vận động đã được xác thực thành FitPoints — đổi lấy hoàn tiền vào ví điện tử, voucher và ưu đãi phí bảo hiểm.',
    'lp.hero.ctaPrimary': 'Tạo tài khoản',
    'lp.hero.ctaSecondary': 'Xem cách hoạt động',
    'lp.hero.check1': 'Xác thực bằng AI',
    'lp.hero.check2': 'Ghi nhận minh bạch trên blockchain',
    'lp.hero.check3': 'Miễn phí sử dụng',

    'lp.card.label': 'Bước chân hôm nay',
    'lp.card.verified': 'Đã xác thực AI',
    'lp.card.steps': '8.420',
    'lp.card.goal': '/ 10.000 bước',
    'lp.card.balance': 'Số dư FitPoints',
    'lp.card.balanceValue': '2.450',
    'lp.card.balanceMeta': '≈ 122.500đ',
    'lp.card.streak': 'Chuỗi ngày',
    'lp.card.streakValue': '5 ngày',
    'lp.card.streakMeta': 'liên tục hoạt động',
    'lp.card.toastTitle': 'Hoạt động đã được ghi nhận',
    'lp.card.toastValue': '+50 FitPoints (≈ 2.500đ)',

    'lp.stat1.value': '7.000 bước',
    'lp.stat1.label': 'hoặc 30 phút = 1 ngày hoạt động',
    'lp.stat2.value': '1 điểm = 50đ',
    'lp.stat2.label': 'giá trị quy đổi trực tiếp',
    'lp.stat3.value': '100 điểm/ngày',
    'lp.stat3.label': 'mức tích tối đa, vận động vừa sức',
    'lp.stat4.value': '0đ phí',
    'lp.stat4.label': 'không phí giao dịch blockchain',

    'lp.how.eyebrow': 'Cách hoạt động',
    'lp.how.title': '3 bước đơn giản',
    'lp.how.step1.title': 'Theo dõi',
    'lp.how.step1.desc': 'Kết nối Apple Health, Google Health Connect hoặc thiết bị đeo. Hoạt động được ghi nhận tự động.',
    'lp.how.step2.title': 'Tích điểm',
    'lp.how.step2.desc': 'AI kiểm tra hoạt động thật, sau đó cộng FitPoints vào tài khoản của bạn mỗi ngày.',
    'lp.how.step3.title': 'Đổi thưởng',
    'lp.how.step3.desc': 'Dùng điểm để nhận hoàn tiền vào ví, voucher từ đối tác hoặc ưu đãi phí bảo hiểm.',

    'lp.rewards.eyebrow': 'Phần thưởng',
    'lp.rewards.title': 'Phần thưởng thật, không chỉ huy hiệu',
    'lp.rewards.desc': 'Phần thưởng do đối tác tài trợ — doanh nghiệp, công ty bảo hiểm và thương hiệu — những bên thực sự được lợi khi bạn khỏe hơn.',
    'lp.rewards.r1.title': 'Hoàn tiền vào ví',
    'lp.rewards.r1.desc': 'Chuyển FitPoints thành tiền mặt trong ví MoMo, ZaloPay qua VietQR / Napas.',
    'lp.rewards.r1.meta': '500 điểm = 25.000đ',
    'lp.rewards.r2.title': 'Voucher đối tác',
    'lp.rewards.r2.desc': 'Cà phê, ăn uống, đồ thể thao từ các thương hiệu đối tác của FitReward.',
    'lp.rewards.r2.meta': 'Đổi ngay trong ứng dụng',
    'lp.rewards.r3.title': 'Ưu đãi bảo hiểm',
    'lp.rewards.r3.desc': 'Duy trì 30 ngày năng động để nhận chứng nhận sức khỏe (SBT) và được giảm phí khi tái tục.',
    'lp.rewards.r3.meta': 'Giảm 10–20% phí bảo hiểm',

    'lp.security.eyebrow': 'Bảo mật & minh bạch',
    'lp.security.title': 'Dữ liệu sức khỏe của bạn luôn là của bạn',
    'lp.security.desc': 'Bạn chủ động đồng ý chia sẻ, và có thể yêu cầu xóa dữ liệu bất cứ lúc nào theo Nghị định 13/2023/NĐ-CP.',
    'lp.security.s1.title': 'AI chống gian lận',
    'lp.security.s1.desc': 'Phát hiện lắc điện thoại, giả lập và GPS giả. Chỉ hoạt động thật mới được tính điểm.',
    'lp.security.s2.title': 'Mã hóa dữ liệu',
    'lp.security.s2.desc': 'Dữ liệu gốc được mã hóa AES-256. Blockchain chỉ lưu mã băm, không lưu thông tin cá nhân.',
    'lp.security.s3.title': 'Ghi nhận minh bạch',
    'lp.security.s3.desc': 'Mỗi lần tích và đổi điểm được ghi lại trên Hyperledger Fabric, không thể chỉnh sửa.',
    'lp.security.s4.title': 'Xác minh VNeID',
    'lp.security.s4.desc': 'eKYC mức 2 trước khi hoàn tiền vào ví, ngăn tài khoản ảo trục lợi.',

    'lp.pricing.eyebrow': 'Gói dịch vụ',
    'lp.pricing.title': 'Bắt đầu miễn phí, nâng cấp khi cần',
    'lp.pricing.perMonth': '/ tháng',
    'lp.pricing.free.name': 'Miễn phí',
    'lp.pricing.free.price': '0đ',
    'lp.pricing.free.f1': 'Theo dõi và xác thực hoạt động',
    'lp.pricing.free.f2': 'Tích FitPoints mỗi ngày',
    'lp.pricing.free.f3': 'Đổi hoàn tiền và voucher',
    'lp.pricing.free.cta': 'Bắt đầu',
    'lp.pricing.plus.badge': 'Phổ biến',
    'lp.pricing.plus.price': '49.000đ',
    'lp.pricing.plus.yearly': 'hoặc 399.000đ / năm',
    'lp.pricing.plus.f1': 'Mọi tính năng gói Miễn phí',
    'lp.pricing.plus.f2': 'Phần thưởng cao hơn',
    'lp.pricing.plus.f3': 'Tính năng độc quyền',
    'lp.pricing.plus.cta': 'Dùng thử Plus',

    'lp.cta.title': 'Bắt đầu biến thói quen tốt thành tài sản',
    'lp.cta.desc': 'Đăng ký trong 2 phút. Kết nối thiết bị, đặt mục tiêu và nhận điểm ngay hôm nay.',
    'lp.cta.button': 'Tạo tài khoản miễn phí',

    'lp.footer.privacy': 'Chính sách bảo mật',
    'lp.footer.business': 'Dành cho doanh nghiệp',
    'lp.footer.support': 'Hỗ trợ',

    // ---------------- Auth & onboarding ----------------
    'auth.register.eyebrow': 'Bắt đầu hành trình sức khỏe',
    'auth.register.title': 'Đăng ký FitReward',
    'auth.register.submit': 'Đăng ký',
    'auth.register.social': 'hoặc đăng ký bằng',
    'auth.login.eyebrow': 'Chào mừng trở lại',
    'auth.login.title': 'Đăng nhập FitReward',
    'auth.login.submit': 'Đăng nhập',
    'auth.login.social': 'hoặc đăng nhập bằng',
    'auth.field.name': 'Họ và tên',
    'auth.field.namePlaceholder': 'Nguyễn Văn A',
    'auth.field.email': 'E-mail',
    'auth.field.password': 'Mật khẩu',
    'auth.footer.haveAccount': 'Đã có tài khoản?',
    'auth.footer.noAccount': 'Chưa có tài khoản?',
    'auth.footer.signIn': 'Đăng nhập',
    'auth.footer.signUp': 'Đăng ký',

    'auth.connect.eyebrow': 'Tích hợp thiết bị',
    'auth.connect.title': 'Kết nối dữ liệu sức khỏe',
    'auth.connect.desc': 'Chọn thiết bị hoặc ứng dụng thể chất để hệ thống tự động ghi nhận hoạt động.',
    'auth.connect.privacy': 'Dữ liệu sức khỏe được mã hóa AES-256 và chỉ truy cập khi có sự đồng ý của bạn.',
    'auth.connect.continue': 'Tiếp tục vào Dashboard',

    'auth.right.title': 'Mỗi bước chân bạn đi là một đồng tiết kiệm.',
    'auth.right.desc': 'FitReward là nền tảng Fintech tiên phong tại Việt Nam chuyển hóa hoạt động thể chất hàng ngày thành giá trị tài chính thực thụ: Cashback ví điện tử, giảm phí bảo hiểm sức khỏe và phiếu mua sắm từ đối tác.',
    'auth.right.v1.title': 'Health-to-Earn',
    'auth.right.v1.desc': 'Chuyển đổi hoạt động thể chất đã được xác thực thành điểm thưởng FitPoints tự động.',
    'auth.right.v2.title': 'Giảm phí bảo hiểm',
    'auth.right.v2.desc': 'Chứng nhận sức khỏe mã hóa SHA-256 giúp bạn giảm phí bảo hiểm liên kết từ đối tác.',
    'auth.right.v3.title': 'Thanh toán & Cashback tức thì',
    'auth.right.v3.desc': 'Rút tiền hoàn về ví MoMo, ZaloPay hoặc tài khoản ngân hàng thông qua VietQR.',

    'device.other': 'Thiết bị đeo khác',
    'device.status.connected': 'Đã kết nối',
    'device.status.notConnected': 'Chưa kết nối',
    'device.btn.connect': 'Kết nối',
    'device.btn.connected': 'Đã kết nối',

    'aria.showPassword': 'Hiển thị mật khẩu',
    'aria.hidePassword': 'Ẩn mật khẩu',

    'err.nameRequired': 'Vui lòng nhập họ và tên của bạn',
    'err.emailRequired': 'Vui lòng nhập địa chỉ email',
    'err.emailInvalid': 'Email không đúng định dạng (vd: user@example.com)',
    'err.passwordRequired': 'Vui lòng nhập mật khẩu',
    'err.passwordShort': 'Mật khẩu phải từ 6 ký tự trở lên',
    'err.emailTaken': 'Email này đã được sử dụng!',
    'err.accountNotFound': 'Tài khoản không tồn tại trên hệ thống!',
    'err.passwordWrong': 'Mật khẩu không chính xác!',

    // ---------------- Toasts ----------------
    'toast.facebookSoon': 'Đăng nhập Facebook sẽ ra mắt sau',
    'toast.googleSoon': 'Đăng nhập Google sẽ ra mắt sau',
    'toast.appleSoon': 'Đăng nhập Apple sẽ ra mắt sau',
    'toast.comingSoon': 'Tính năng sẽ ra mắt sau',
    'toast.registerSuccess': 'Đăng ký tài khoản thành công!',
    'toast.storageError': 'Lỗi khi lưu trữ dữ liệu cục bộ.',
    'toast.loginFailed': 'Tài khoản hoặc mật khẩu không đúng!',
    'toast.welcome': 'Xin chào, {name}!',
    'toast.logout': 'Đã đăng xuất thành công.',
    'toast.deviceConnected': 'Kết nối thành công với {device}!',
    'toast.deviceDisconnected': 'Đã ngắt kết nối với {device}.',
    'toast.notification': 'Bạn có 1 thông báo mới: Đã hoàn thành mục tiêu 7.000 bước!',
    'toast.claimed': 'Đã nhận thưởng +100 FitPoints cho hôm nay!',
    'toast.notEnoughPoints': 'Bạn cần tối thiểu {cost} FitPoints để đổi {reward}. (Hiện có: {balance} PTS)',
    'toast.redeemSuccess': 'Đổi quà thành công! Đã quy đổi {cost} FitPoints cho {reward}.',
    'toast.syncing': 'Đang quét cảm biến thiết bị...',
    'toast.streakKeepGoing': 'Tiếp tục duy trì bước chân hôm nay để chạm mốc 7 ngày!',
    'toast.familyInvited': 'Đã mời các thành viên gia đình tham gia!',

    // ---------------- Dashboard shell ----------------
    'nav.mainMenu': 'MENU CHÍNH',
    'nav.dashboard': 'Tổng quan',
    'nav.activity': 'Hoạt động',
    'nav.rewards': 'Phần thưởng',
    'nav.challenges': 'Thử thách',
    'nav.family': 'Gia đình',
    'nav.history': 'Lịch sử thưởng',
    'nav.devices': 'Quản lý thiết bị',
    'nav.profile': 'Hồ sơ',
    'nav.settings': 'Cài đặt',
    'nav.logout': 'Đăng xuất',

    'page.dashboard': 'Tổng quan',
    'page.activity': 'Chi tiết hoạt động',
    'page.rewards': 'Danh mục phần thưởng',
    'page.challenges': 'Thử thách & Mục tiêu',
    'page.history': 'Lịch sử phần thưởng',
    'page.devices': 'Quản lý thiết bị',
    'page.profile': 'Hồ sơ người dùng',
    'page.family': 'Gia đình',
    'page.settings': 'Cài đặt',

    'topbar.subtitle': 'Theo dõi hoạt động và biến thói quen lành mạnh thành phần thưởng.',
    'topbar.notifications': 'Thông báo',
    'user.tier': 'FitReward Plus',

    'unit.pts': 'PTS',
    'unit.min': 'phút',
    'unit.days': 'ngày',

    'kpi.fitpoints': 'FitPoints',
    'kpi.weekly': '+150 tuần này',
    'kpi.steps': 'Bước chân hôm nay',
    'kpi.goalMet': 'Đã hoàn thành mục tiêu',
    'kpi.activeMin': 'Phút vận động',
    'kpi.activeChange': '+12% so với tuần trước',
    'kpi.streak': 'Chuỗi hiện tại',
    'kpi.keepGoing': 'Tiếp tục phát huy!',

    'day.mon': 'T2',
    'day.tue': 'T3',
    'day.wed': 'T4',
    'day.thu': 'T5',
    'day.fri': 'T6',
    'day.sat': 'T7',
    'day.sun': 'CN',

    'chart.title': 'Tổng quan hoạt động',
    'chart.desc': 'Xu hướng bước chân theo tuần & mục tiêu hằng ngày',
    'chart.viewActivity': 'Xem hoạt động →',
    'chart.stepsTooltip': '{steps} bước',
    'chart.todaySteps': '{steps} bước hôm nay',
    'chart.goal': 'Mục tiêu: {goal} bước',
    'chart.goalLine': 'Đường mục tiêu: 7.000',
    'chart.reached': '✓ Đã đạt',

    'challenge.activeToday': 'HÔM NAY',
    'challenge.completed': '✓ Hoàn thành',
    'challenge.daily.title': 'Đi bộ 7.000 bước',
    'challenge.daily.subtitle': 'Hoàn thành cột mốc bước chân hằng ngày để nhận FitPoints.',
    'challenge.progress': '{current} / {goal} bước',
    'challenge.reward': 'Phần thưởng:',
    'challenge.claimed': 'Đã nhận',
    'challenge.recommended': 'Thử thách đề xuất',
    'challenge.weekly.title': 'Thử thách đi bộ 7 ngày',
    'challenge.weekly.meta': 'Đã hoàn thành 5 / 7 ngày',
    'challenge.continue': 'Tiếp tục thử thách',

    'feed.title': 'Hoạt động FitPoints',
    'feed.desc': 'Điểm thưởng gần đây từ thói quen lành mạnh đã xác thực',
    'feed.viewAll': 'Xem tất cả →',

    'tx.walk': 'Đi bộ — 7.000 bước',
    'tx.walk.time': 'Hôm nay, 18:30 • Cảm biến đã xác thực',
    'tx.workout': 'Tập luyện — 30 phút',
    'tx.workout.time': 'Hôm qua, 07:15 • Dữ liệu nhịp tim',
    'tx.weekly': 'Thử thách tuần',
    'tx.weekly.time': '3 ngày trước • Chuỗi cột mốc',
    'tx.daily': 'Thử thách ngày — 7.000 bước',
    'tx.daily.time': 'Vừa xong • Cảm biến đã xác thực',
    'tx.redeem': 'Đổi quà: {reward}',
    'tx.redeem.time': 'Vừa xong • Đã duyệt hoàn tiền',

    'rewardsCard.title': 'Phần thưởng khả dụng',
    'rewardsCard.desc': 'Đổi điểm lấy tiền mặt & voucher',
    'rewardsCard.catalog': 'Danh mục →',

    'reward.cashback.name': 'Hoàn tiền 20.000₫',
    'reward.cashback.cost': '500 FitPoints • Ví MoMo / VietQR',
    'reward.gym.name': 'Voucher Gym 1 ngày',
    'reward.gym.cost': '300 FitPoints • California / CityGym',
    'reward.insurance.name': 'Giảm 10% phí bảo hiểm',
    'reward.insurance.cost': '1.000 FitPoints • Bảo Việt / Prudential',
    'reward.cashbackMomo.name': 'Hoàn tiền 20.000₫ ví MoMo',
    'reward.cashbackMomo.cost': '500 FitPoints • Rút tiền tức thì',
    'reward.cashback50.name': 'Hoàn tiền 50.000₫ chuyển khoản VietQR',
    'reward.cashback50.cost': '1.200 FitPoints • Ngân hàng liên kết',
    'reward.gymDay.name': 'Vé tập Gym 1 ngày (California / CityGym)',
    'reward.gymDay.cost': '300 FitPoints • Mã QR tại quầy',
    'reward.insuranceBaoViet.name': 'Voucher giảm 10% phí bảo hiểm Bảo Việt',
    'reward.insuranceBaoViet.cost': '1.000 FitPoints • Hợp đồng mới hoặc tái tục',

    'btn.redeem': 'Đổi',
    'btn.view': 'Xem',

    'quick.title': 'Thao tác nhanh',
    'quick.activity': 'Xem hoạt động',
    'quick.redeem': 'Đổi phần thưởng',
    'quick.challenge': 'Tham gia thử thách',
    'quick.device': 'Kết nối thiết bị',

    'health.title': 'Dữ liệu sức khỏe',
    'health.desc': 'Đồng bộ thiết bị đeo & hệ sinh thái sức khỏe',
    'health.manage': 'Quản lý thiết bị →',
    'health.manageBtn': 'Quản lý thiết bị',
    'sync.connected': '✓ Đã kết nối',
    'sync.notConnected': 'Chưa kết nối',

    // ---------------- Dashboard subpages ----------------
    'sp.activity.title': 'Chi tiết hoạt động & bước chân',
    'sp.activity.desc': 'Dữ liệu đồng bộ trực tiếp từ Apple Health & Garmin',
    'sp.activity.syncNow': 'Đồng bộ ngay',
    'sp.activity.today': 'Hôm nay',
    'sp.activity.steps': '{steps} bước',
    'sp.activity.distance': 'Cự ly ước tính',
    'sp.activity.calories': 'Calo tiêu hao',
    'sp.activity.activeTime': 'Thời gian vận động',
    'sp.activity.minutes': '{minutes} phút',

    'sp.rewards.title': 'Kho phần thưởng FitReward',
    'sp.rewards.balance': 'Số dư khả dụng:',

    'sp.challenges.title': 'Thử thách thể chất FitReward',
    'sp.challenges.desc': 'Hoàn thành thử thách để nhận FitPoints và duy trì chuỗi Streak',
    'sp.challenges.daily.name': 'Mục tiêu ngày: Đi bộ 7.000 bước',
    'sp.challenges.daily.meta': 'Đã đạt {current} / {goal} bước • Thưởng +100 FitPoints',
    'sp.challenges.claim': 'Nhận thưởng',
    'sp.challenges.streak.name': 'Thử thách 7 ngày liên tục (Streak Master)',
    'sp.challenges.streak.meta': 'Tiến độ: 5 / 7 ngày • Thưởng +300 FitPoints',
    'sp.challenges.continue': 'Tiếp tục',
    'sp.challenges.family.name': 'Thử thách gia đình: 50.000 bước / tuần',
    'sp.challenges.family.meta': 'Tham gia cùng các thành viên • Thưởng +500 FitPoints',
    'sp.challenges.join': 'Tham gia',

    'sp.history.title': 'Lịch sử nhận & đổi thưởng',
    'sp.history.desc': 'Sổ cái ghi nhận điểm FitPoints minh bạch',
    'sp.history.empty': 'Chưa có giao dịch nào.',

    'sp.devices.title': 'Quản lý kết nối thiết bị',
    'sp.devices.desc': 'Liên kết các cảm biến bước chân để tự động tính điểm',

    'sp.profile.title': 'Hồ sơ người dùng',
    'sp.profile.desc': 'Thông tin tài khoản FitReward cá nhân',
    'sp.profile.logout': 'Đăng xuất',
    'sp.profile.member': 'Thành viên FitReward Plus',

    'sp.placeholder': 'Nội dung đang được cập nhật trong phiên bản tiếp theo.'
  },

  en: {
    'meta.title': 'FitReward - Health-to-Earn Fintech Platform',
    'lang.label': 'Language',

    // ---------------- Landing page ----------------
    'lp.nav.how': 'How it works',
    'lp.nav.rewards': 'Rewards',
    'lp.nav.security': 'Security',
    'lp.nav.pricing': 'Pricing',
    'lp.nav.login': 'Log in',
    'lp.nav.start': 'Get started free',

    'lp.hero.badge': 'Health-to-Earn for young urban Vietnamese',
    'lp.hero.title': 'Every step<br>has <span class="lp-accent">real value</span>',
    'lp.hero.desc': 'Turn verified activity into FitPoints — redeem them for e-wallet cashback, vouchers and insurance premium discounts.',
    'lp.hero.ctaPrimary': 'Create account',
    'lp.hero.ctaSecondary': 'See how it works',
    'lp.hero.check1': 'AI-verified',
    'lp.hero.check2': 'Transparently recorded on blockchain',
    'lp.hero.check3': 'Free to use',

    'lp.card.label': "Today's steps",
    'lp.card.verified': 'AI verified',
    'lp.card.steps': '8,420',
    'lp.card.goal': '/ 10,000 steps',
    'lp.card.balance': 'FitPoints balance',
    'lp.card.balanceValue': '2,450',
    'lp.card.balanceMeta': '≈ 122,500₫',
    'lp.card.streak': 'Streak',
    'lp.card.streakValue': '5 days',
    'lp.card.streakMeta': 'active in a row',
    'lp.card.toastTitle': 'Activity recorded',
    'lp.card.toastValue': '+50 FitPoints (≈ 2,500₫)',

    'lp.stat1.value': '7,000 steps',
    'lp.stat1.label': 'or 30 minutes = 1 active day',
    'lp.stat2.value': '1 point = 50₫',
    'lp.stat2.label': 'direct conversion value',
    'lp.stat3.value': '100 points/day',
    'lp.stat3.label': 'daily cap at a comfortable pace',
    'lp.stat4.value': '₫0 fees',
    'lp.stat4.label': 'no blockchain transaction fees',

    'lp.how.eyebrow': 'How it works',
    'lp.how.title': '3 simple steps',
    'lp.how.step1.title': 'Track',
    'lp.how.step1.desc': 'Connect Apple Health, Google Health Connect or a wearable. Your activity is recorded automatically.',
    'lp.how.step2.title': 'Earn',
    'lp.how.step2.desc': 'AI verifies that your activity is real, then credits FitPoints to your account every day.',
    'lp.how.step3.title': 'Redeem',
    'lp.how.step3.desc': 'Use your points for wallet cashback, partner vouchers or insurance premium discounts.',

    'lp.rewards.eyebrow': 'Rewards',
    'lp.rewards.title': 'Real rewards, not just badges',
    'lp.rewards.desc': 'Rewards are funded by partners — employers, insurers and brands — who genuinely benefit when you get healthier.',
    'lp.rewards.r1.title': 'Wallet cashback',
    'lp.rewards.r1.desc': 'Convert FitPoints into cash in your MoMo or ZaloPay wallet via VietQR / Napas.',
    'lp.rewards.r1.meta': '500 points = 25,000₫',
    'lp.rewards.r2.title': 'Partner vouchers',
    'lp.rewards.r2.desc': 'Coffee, dining and sportswear from FitReward partner brands.',
    'lp.rewards.r2.meta': 'Redeem instantly in the app',
    'lp.rewards.r3.title': 'Insurance perks',
    'lp.rewards.r3.desc': 'Stay active for 30 days to earn a health certificate (SBT) and a discount when you renew.',
    'lp.rewards.r3.meta': '10–20% off insurance premiums',

    'lp.security.eyebrow': 'Security & transparency',
    'lp.security.title': 'Your health data always stays yours',
    'lp.security.desc': 'You choose what to share, and you can request deletion at any time under Decree 13/2023/ND-CP.',
    'lp.security.s1.title': 'AI anti-fraud',
    'lp.security.s1.desc': 'Detects phone shaking, emulators and GPS spoofing. Only real activity earns points.',
    'lp.security.s2.title': 'Data encryption',
    'lp.security.s2.desc': 'Raw data is AES-256 encrypted. The blockchain stores only hashes, never personal information.',
    'lp.security.s3.title': 'Transparent ledger',
    'lp.security.s3.desc': 'Every earning and redemption is recorded on Hyperledger Fabric and cannot be altered.',
    'lp.security.s4.title': 'VNeID verification',
    'lp.security.s4.desc': 'Level-2 eKYC before wallet cashout stops fake accounts from gaming the system.',

    'lp.pricing.eyebrow': 'Pricing',
    'lp.pricing.title': 'Start free, upgrade when you need to',
    'lp.pricing.perMonth': '/ month',
    'lp.pricing.free.name': 'Free',
    'lp.pricing.free.price': '₫0',
    'lp.pricing.free.f1': 'Activity tracking & verification',
    'lp.pricing.free.f2': 'Earn FitPoints every day',
    'lp.pricing.free.f3': 'Redeem cashback & vouchers',
    'lp.pricing.free.cta': 'Get started',
    'lp.pricing.plus.badge': 'Popular',
    'lp.pricing.plus.price': '49,000₫',
    'lp.pricing.plus.yearly': 'or 399,000₫ / year',
    'lp.pricing.plus.f1': 'Everything in Free',
    'lp.pricing.plus.f2': 'Higher rewards',
    'lp.pricing.plus.f3': 'Exclusive features',
    'lp.pricing.plus.cta': 'Try Plus',

    'lp.cta.title': 'Start turning good habits into assets',
    'lp.cta.desc': 'Sign up in 2 minutes. Connect a device, set a goal and start earning points today.',
    'lp.cta.button': 'Create a free account',

    'lp.footer.privacy': 'Privacy policy',
    'lp.footer.business': 'For businesses',
    'lp.footer.support': 'Support',

    // ---------------- Auth & onboarding ----------------
    'auth.register.eyebrow': 'Start your health journey',
    'auth.register.title': 'Sign up for FitReward',
    'auth.register.submit': 'Sign Up',
    'auth.register.social': 'or sign up with',
    'auth.login.eyebrow': 'Welcome back',
    'auth.login.title': 'Sign in to FitReward',
    'auth.login.submit': 'Sign In',
    'auth.login.social': 'or sign in with',
    'auth.field.name': 'Full name',
    'auth.field.namePlaceholder': 'John Doe',
    'auth.field.email': 'Email',
    'auth.field.password': 'Password',
    'auth.footer.haveAccount': 'Have an account?',
    'auth.footer.noAccount': "Don't have an account?",
    'auth.footer.signIn': 'Sign in',
    'auth.footer.signUp': 'Sign up',

    'auth.connect.eyebrow': 'Device integration',
    'auth.connect.title': 'Connect your health data',
    'auth.connect.desc': 'Choose a device or fitness app so your activity is recorded automatically.',
    'auth.connect.privacy': 'Health data is AES-256 encrypted and only accessed with your consent.',
    'auth.connect.continue': 'Continue to Dashboard',

    'auth.right.title': 'Every step you take is money saved.',
    'auth.right.desc': 'FitReward is a pioneering Vietnamese fintech platform that turns everyday physical activity into real financial value: e-wallet cashback, lower health insurance premiums and shopping vouchers from partners.',
    'auth.right.v1.title': 'Health-to-Earn',
    'auth.right.v1.desc': 'Verified physical activity is automatically converted into FitPoints rewards.',
    'auth.right.v2.title': 'Lower insurance premiums',
    'auth.right.v2.desc': 'SHA-256 encrypted health certificates help you get discounts from partner insurers.',
    'auth.right.v3.title': 'Instant payouts & cashback',
    'auth.right.v3.desc': 'Withdraw cashback to MoMo, ZaloPay or your bank account via VietQR.',

    'device.other': 'Other wearables',
    'device.status.connected': 'Connected',
    'device.status.notConnected': 'Not connected',
    'device.btn.connect': 'Connect',
    'device.btn.connected': 'Connected',

    'aria.showPassword': 'Show password',
    'aria.hidePassword': 'Hide password',

    'err.nameRequired': 'Please enter your full name',
    'err.emailRequired': 'Please enter your email address',
    'err.emailInvalid': 'Invalid email format (e.g. user@example.com)',
    'err.passwordRequired': 'Please enter your password',
    'err.passwordShort': 'Password must be at least 6 characters',
    'err.emailTaken': 'This email is already in use!',
    'err.accountNotFound': 'This account does not exist!',
    'err.passwordWrong': 'Incorrect password!',

    // ---------------- Toasts ----------------
    'toast.facebookSoon': 'Facebook sign-in is coming soon',
    'toast.googleSoon': 'Google sign-in is coming soon',
    'toast.appleSoon': 'Apple sign-in is coming soon',
    'toast.comingSoon': 'Coming soon',
    'toast.registerSuccess': 'Account created successfully!',
    'toast.storageError': 'Could not save data to local storage.',
    'toast.loginFailed': 'Incorrect email or password!',
    'toast.welcome': 'Welcome, {name}!',
    'toast.logout': 'You have been logged out.',
    'toast.deviceConnected': 'Connected to {device}!',
    'toast.deviceDisconnected': 'Disconnected from {device}.',
    'toast.notification': 'You have 1 new notification: you reached your 7,000-step goal!',
    'toast.claimed': 'Claimed +100 FitPoints for today!',
    'toast.notEnoughPoints': 'You need at least {cost} FitPoints to redeem {reward}. (Balance: {balance} PTS)',
    'toast.redeemSuccess': 'Redeemed! {cost} FitPoints exchanged for {reward}.',
    'toast.syncing': 'Scanning device sensors...',
    'toast.streakKeepGoing': 'Keep walking today to reach the 7-day milestone!',
    'toast.familyInvited': 'Your family members have been invited!',

    // ---------------- Dashboard shell ----------------
    'nav.mainMenu': 'MAIN MENU',
    'nav.dashboard': 'Dashboard',
    'nav.activity': 'Activity',
    'nav.rewards': 'Rewards',
    'nav.challenges': 'Challenges',
    'nav.family': 'Family',
    'nav.history': 'Reward History',
    'nav.devices': 'Manage Devices',
    'nav.profile': 'Profile',
    'nav.settings': 'Settings',
    'nav.logout': 'Logout',

    'page.dashboard': 'Dashboard',
    'page.activity': 'Activity Details',
    'page.rewards': 'Rewards Catalog',
    'page.challenges': 'Challenges & Goals',
    'page.history': 'Reward History',
    'page.devices': 'Manage Devices',
    'page.profile': 'User Profile',
    'page.family': 'Family',
    'page.settings': 'Settings',

    'topbar.subtitle': 'Track your activity and turn healthy habits into rewards.',
    'topbar.notifications': 'Notifications',
    'user.tier': 'FitReward Plus',

    'unit.pts': 'PTS',
    'unit.min': 'min',
    'unit.days': 'days',

    'kpi.fitpoints': 'FitPoints',
    'kpi.weekly': '+150 this week',
    'kpi.steps': "Today's Steps",
    'kpi.goalMet': 'Goal completed',
    'kpi.activeMin': 'Active Minutes',
    'kpi.activeChange': '+12% vs last week',
    'kpi.streak': 'Current Streak',
    'kpi.keepGoing': 'Keep it going!',

    'day.mon': 'Mon',
    'day.tue': 'Tue',
    'day.wed': 'Wed',
    'day.thu': 'Thu',
    'day.fri': 'Fri',
    'day.sat': 'Sat',
    'day.sun': 'Sun',

    'chart.title': 'Activity Overview',
    'chart.desc': 'Weekly step trends & daily physical targets',
    'chart.viewActivity': 'View Activity →',
    'chart.stepsTooltip': '{steps} steps',
    'chart.todaySteps': '{steps} steps today',
    'chart.goal': 'Goal: {goal} steps',
    'chart.goalLine': 'Goal Line: 7,000',
    'chart.reached': '✓ Reached',

    'challenge.activeToday': 'ACTIVE TODAY',
    'challenge.completed': '✓ Completed',
    'challenge.daily.title': 'Walk 7,000 steps',
    'challenge.daily.subtitle': 'Complete your daily step milestone to earn FitPoints.',
    'challenge.progress': '{current} / {goal} steps',
    'challenge.reward': 'Reward:',
    'challenge.claimed': 'Claimed',
    'challenge.recommended': 'Recommended Challenge',
    'challenge.weekly.title': '7-Day Walking Challenge',
    'challenge.weekly.meta': '5 / 7 days completed',
    'challenge.continue': 'Continue Challenge',

    'feed.title': 'FitPoints Activity',
    'feed.desc': 'Recent verified healthy habit earnings',
    'feed.viewAll': 'View all →',

    'tx.walk': 'Walking — 7,000 steps',
    'tx.walk.time': 'Today, 18:30 • Verified Sensor',
    'tx.workout': 'Workout — 30 minutes',
    'tx.workout.time': 'Yesterday, 07:15 • Heart Rate Log',
    'tx.weekly': 'Weekly Challenge',
    'tx.weekly.time': '3 days ago • Milestone Streak',
    'tx.daily': 'Daily Challenge — 7,000 steps',
    'tx.daily.time': 'Just now • Verified Sensor',
    'tx.redeem': 'Redeemed: {reward}',
    'tx.redeem.time': 'Just now • Cashback approved',

    'rewardsCard.title': 'Available Rewards',
    'rewardsCard.desc': 'Redeem your points for cash & vouchers',
    'rewardsCard.catalog': 'Catalog →',

    'reward.cashback.name': '₫20,000 Cashback',
    'reward.cashback.cost': '500 FitPoints • MoMo wallet / VietQR',
    'reward.gym.name': '1-Day Gym Voucher',
    'reward.gym.cost': '300 FitPoints • California / CityGym',
    'reward.insurance.name': '10% Off Insurance Premium',
    'reward.insurance.cost': '1,000 FitPoints • Bảo Việt / Prudential',
    'reward.cashbackMomo.name': '₫20,000 MoMo Wallet Cashback',
    'reward.cashbackMomo.cost': '500 FitPoints • Instant withdrawal',
    'reward.cashback50.name': '₫50,000 VietQR Bank Transfer Cashback',
    'reward.cashback50.cost': '1,200 FitPoints • Linked bank account',
    'reward.gymDay.name': '1-Day Gym Pass (California / CityGym)',
    'reward.gymDay.cost': '300 FitPoints • QR code at the front desk',
    'reward.insuranceBaoViet.name': '10% Off Bảo Việt Insurance Voucher',
    'reward.insuranceBaoViet.cost': '1,000 FitPoints • New or renewed policies',

    'btn.redeem': 'Redeem',
    'btn.view': 'View',

    'quick.title': 'Quick Actions',
    'quick.activity': 'View Activity',
    'quick.redeem': 'Redeem Rewards',
    'quick.challenge': 'Join Challenge',
    'quick.device': 'Connect Device',

    'health.title': 'Health Data',
    'health.desc': 'Active wearable & health ecosystem sync',
    'health.manage': 'Manage Devices →',
    'health.manageBtn': 'Manage Devices',
    'sync.connected': '✓ Connected',
    'sync.notConnected': 'Not Connected',

    // ---------------- Dashboard subpages ----------------
    'sp.activity.title': 'Activity & Step Details',
    'sp.activity.desc': 'Synced directly from Apple Health & Garmin',
    'sp.activity.syncNow': 'Sync now',
    'sp.activity.today': 'Today',
    'sp.activity.steps': '{steps} steps',
    'sp.activity.distance': 'Estimated distance',
    'sp.activity.calories': 'Calories burned',
    'sp.activity.activeTime': 'Active time',
    'sp.activity.minutes': '{minutes} min',

    'sp.rewards.title': 'FitReward Rewards Store',
    'sp.rewards.balance': 'Available balance:',

    'sp.challenges.title': 'FitReward Fitness Challenges',
    'sp.challenges.desc': 'Complete challenges to earn FitPoints and keep your streak alive',
    'sp.challenges.daily.name': 'Daily goal: Walk 7,000 steps',
    'sp.challenges.daily.meta': 'Reached {current} / {goal} steps • Reward +100 FitPoints',
    'sp.challenges.claim': 'Claim',
    'sp.challenges.streak.name': '7-Day Streak Challenge (Streak Master)',
    'sp.challenges.streak.meta': 'Progress: 5 / 7 days • Reward +300 FitPoints',
    'sp.challenges.continue': 'Continue',
    'sp.challenges.family.name': 'Family Challenge: 50,000 steps / week',
    'sp.challenges.family.meta': 'Join with your family • Reward +500 FitPoints',
    'sp.challenges.join': 'Join',

    'sp.history.title': 'Earning & Redemption History',
    'sp.history.desc': 'A transparent FitPoints ledger',
    'sp.history.empty': 'No transactions yet.',

    'sp.devices.title': 'Manage Device Connections',
    'sp.devices.desc': 'Link step sensors to earn points automatically',

    'sp.profile.title': 'User Profile',
    'sp.profile.desc': 'Your personal FitReward account details',
    'sp.profile.logout': 'Log Out',
    'sp.profile.member': 'FitReward Plus Member',

    'sp.placeholder': 'This section is coming in the next release.'
  }
};

let currentLang = (() => {
  const saved = localStorage.getItem(LANG_STORAGE_KEY);
  return SUPPORTED_LANGS.includes(saved) ? saved : 'vi';
})();

/**
 * Looks up a translation and fills {placeholders} from params.
 * Falls back to Vietnamese, then to the key itself.
 */
function t(key, params = {}) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.vi;
  const template = dict[key] ?? TRANSLATIONS.vi[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (match, name) => (name in params ? params[name] : match));
}

/**
 * Formats a number with the separators of the active language (7.240 vs 7,240).
 */
function formatNumber(value) {
  return Number(value).toLocaleString(currentLang === 'vi' ? 'vi-VN' : 'en-US');
}

/**
 * Translates every element carrying a data-i18n* attribute inside root.
 */
function applyTranslations(root = document) {
  root.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });
  root.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });
  root.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
  });
  root.querySelectorAll('[data-i18n-title]').forEach(el => {
    el.setAttribute('title', t(el.dataset.i18nTitle));
  });
  root.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAriaLabel));
  });

  document.documentElement.lang = currentLang;
  document.title = t('meta.title');

  document.querySelectorAll('.lang-btn').forEach(btn => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}
