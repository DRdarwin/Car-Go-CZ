// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'messages.dart';

// ignore_for_file: type=lint

/// The translations for Czech (`cs`).
class SCs extends S {
  SCs([String locale = 'cs']) : super(locale);

  @override
  String copyright_notice(Object company) {
    return 'Copyright © $company, Všechna práva vyhrazena.';
  }

  @override
  String get welcomeTitle => 'Vítejte v aplikaci';

  @override
  String get today => 'Dnes';

  @override
  String get yesterday => 'Včera';

  @override
  String get settings => 'Nastavení';

  @override
  String get about => 'O nás';

  @override
  String get profileInfo => 'Informace o profilu';

  @override
  String get language => 'Jazyk';

  @override
  String get firstName => 'Jméno';

  @override
  String get lastName => 'Příjmení';

  @override
  String get mobileNumber => 'Mobilní číslo';

  @override
  String get edit => 'Upravit';

  @override
  String get enterCode => 'Zadejte kód';

  @override
  String get editProfile => 'Upravit profil';

  @override
  String get bankTransfer => 'Bankovní převod';

  @override
  String get gift => 'Dárek';

  @override
  String get correction => 'Oprava';

  @override
  String get inappPayment => 'Platba v aplikaci';

  @override
  String get orderFee => 'Poplatek za objednávku';

  @override
  String get parkingFee => 'Poplatek za parkování';

  @override
  String get cancellationFee => 'Poplatek za zrušení';

  @override
  String get withdraw => 'Vybrat';

  @override
  String get walletTransactions => 'Transakce peněženky';

  @override
  String get addCard => 'Přidat kartu';

  @override
  String get visa => 'Visa';

  @override
  String get mastercard => 'Mastercard';

  @override
  String get addBalance => 'Přidat saldo';

  @override
  String durationInMinutes(num minutes) {
    final intl.NumberFormat minutesNumberFormat = intl.NumberFormat.compact(
      locale: localeName,
    );
    final String minutesString = minutesNumberFormat.format(minutes);

    String _temp0 = intl.Intl.pluralLogic(
      minutes,
      locale: localeName,
      other: '$minutesString Minut',
      one: '$minutesString Minuta',
      zero: 'Nula minut',
    );
    return '$_temp0';
  }

  @override
  String durationInHours(num hours) {
    final intl.NumberFormat hoursNumberFormat = intl.NumberFormat.compact(
      locale: localeName,
    );
    final String hoursString = hoursNumberFormat.format(hours);

    String _temp0 = intl.Intl.pluralLogic(
      hours,
      locale: localeName,
      other: '$hoursString Hodin',
      one: '$hoursString Hodina',
      zero: 'Nula hodin',
    );
    return 'Doba trvání: $_temp0';
  }

  @override
  String get timePastDue => 'Po termínu';

  @override
  String get justNow => 'Právě teď';

  @override
  String distanceInMeters(num distance) {
    final intl.NumberFormat distanceNumberFormat = intl.NumberFormat.compact(
      locale: localeName,
    );
    final String distanceString = distanceNumberFormat.format(distance);

    return '$distanceString m';
  }

  @override
  String distanceInKilometers(num distance) {
    final intl.NumberFormat distanceNumberFormat = intl.NumberFormat.compact(
      locale: localeName,
    );
    final String distanceString = distanceNumberFormat.format(distance);

    return '$distanceString km';
  }

  @override
  String distanceInFeets(num distance) {
    final intl.NumberFormat distanceNumberFormat = intl.NumberFormat.compact(
      locale: localeName,
    );
    final String distanceString = distanceNumberFormat.format(distance);

    return '$distanceString ft';
  }

  @override
  String distanceInMiles(num distance) {
    final intl.NumberFormat distanceNumberFormat = intl.NumberFormat.compact(
      locale: localeName,
    );
    final String distanceString = distanceNumberFormat.format(distance);

    return '$distanceString mi';
  }

  @override
  String get welcomeSubtitle =>
      'Taxi služba navržená pro vaše pohodlí, jízdy s vašimi oblíbenými řidiči a výběr preferencí jízdy';

  @override
  String get onboardingRewardTitle => 'Získejte odměny!';

  @override
  String get onboardingRewardSubtitle =>
      'Získejte extra bonusy za doporučení přítele, dokončení jízd a mnoho dalšího...';

  @override
  String get selectLanguage => 'Vyberte jazyk';

  @override
  String get searchForLanguage => 'Hledat jazyk';

  @override
  String get enterPhoneNumber => 'Zadejte telefonní číslo';

  @override
  String get actionContinue => 'Pokračovat';

  @override
  String get whereIsYourDestination => 'Kam jedete?';

  @override
  String get whereAreYouGoing => 'Kam jedete?';

  @override
  String get selectDestinations => 'Vaše trasa';

  @override
  String get pickupPoint => 'Místo vyzvednutí';

  @override
  String get enterPickupPoint => 'Zadejte místo vyzvednutí';

  @override
  String get dropoffPoint => 'Místo vyložení';

  @override
  String get enterDropoffPoint => 'Zadejte místo vyložení';

  @override
  String get stopPoint => 'Mezizastávka';

  @override
  String get enterStopPoint => 'Zadejte mezizastávku';

  @override
  String get confirm => 'Potvrdit';

  @override
  String get confirmDropoff => 'Potvrdit vyložení';

  @override
  String get confirmPickup => 'Potvrdit vyzvednutí';

  @override
  String get enterAtLeast3Characters => 'Zadejte alespoň 3 znaky';

  @override
  String get noResults => 'Žádné výsledky';

  @override
  String get bookNow => 'Rezervovat nyní';

  @override
  String get cash => 'Hotovost';

  @override
  String get online => 'Online';

  @override
  String get offline => 'Offline';

  @override
  String get onTrip => 'Na cestě';

  @override
  String get confirmPay => 'Potvrdit a zaplatit';

  @override
  String get cancel => 'Zrušit';

  @override
  String get apply => 'Použít';

  @override
  String get enterCouponCode => 'Zadejte kód kuponu';

  @override
  String get reserveRide => 'Rezervovat jízdu';

  @override
  String get reserveRideMessage =>
      'Vyberte přesné datum a čas, kdy chcete, aby byla vaše jízda rezervována';

  @override
  String get reserveRideMessageSuccess =>
      'Vaše jízda byla úspěšně rezervována. Můžete si ji prohlédnout v sekci „Plánované jízdy“.';

  @override
  String get cancelReservation => 'Zrušit rezervaci';

  @override
  String get confirmResrve => 'Potvrdit a rezervovat';

  @override
  String get enterCouponDescription =>
      'Zadejte svůj kuponový kód pro použití na ceny';

  @override
  String get enterCoupon => 'Zadejte kupon';

  @override
  String get couponApplied => 'Kupon použit';

  @override
  String get couponAppliedDescription => 'Kupon byl použit na cenu vaší jízdy';

  @override
  String get done => 'Hotovo!';

  @override
  String get ridePreferences => 'Preference jízdy';

  @override
  String get noWaitTime => 'Žádný čekací čas';

  @override
  String minutesRange(String minutes) {
    return '$minutes minut';
  }

  @override
  String secondsRange(String seconds) {
    return '$seconds sekund';
  }

  @override
  String get rideRequested => 'Jízda požadována';

  @override
  String get searchingForAnOnlineDriver => 'Hledání online řidiče...';

  @override
  String get cancelRide => 'Zrušit jízdu';

  @override
  String get rideSafety => 'Bezpečnost jízdy';

  @override
  String get shareTripInformation => 'Sdílet informace o jízdě';

  @override
  String get shareTripInformationDescription =>
      'Můžete sdílet informace o své jízdě s přítelem';

  @override
  String get sos => 'SOS';

  @override
  String get sosDescription => 'Informujte úřady o nouzové situaci';

  @override
  String get reportAnIssue => 'Nahlásit problém';

  @override
  String get reportAnIssueMidTripDescription =>
      'Sdílejte bezpečnostní problém během jízdy';

  @override
  String get rideOptions => 'Možnosti jízdy';

  @override
  String get goBackToRide => 'Vrátit se k jízdě';

  @override
  String get waitTime => 'Čekací doba';

  @override
  String get couponCode => 'Kód kuponu';

  @override
  String get giftCardCode => 'Kód dárkové karty';

  @override
  String get nicePoints => 'Hezké body';

  @override
  String get negativePoints => 'Negativní body';

  @override
  String get reviewCommentBoxHint => 'Přidejte komentář...';

  @override
  String get howWasYourTrip => 'Jaká byla vaše jízda?';

  @override
  String oneStarReviewTitle(String name) {
    return 'Hrozná jízda s $name';
  }

  @override
  String twoStarReviewTitle(String name) {
    return 'Špatná jízda s $name';
  }

  @override
  String threeStarReviewTitle(String name) {
    return 'Průměrná jízda s $name';
  }

  @override
  String fourStarReviewTitle(String name) {
    return 'Dobrá jízda s $name';
  }

  @override
  String fiveStarReviewTitle(String name) {
    return 'Skvělá jízda s $name';
  }

  @override
  String get submitFeedback => 'Odeslat zpětnou vazbu';

  @override
  String get typeAMessage => 'Napište zprávu';

  @override
  String get findAnotherRide => 'Najít jinou jízdu';

  @override
  String get next => 'Další';

  @override
  String get searchForDropoffLocation => 'Hledat místo vyložení';

  @override
  String get searchForPickupLocation => 'Hledat místo vyzvednutí';

  @override
  String get placeConfirmDialogPlaceholder => 'Kde je místo pro vyložení?';

  @override
  String get noAnnouncements => 'Žádné oznámení';

  @override
  String get announcements => 'Oznámení';

  @override
  String reviewsCount(int count) {
    return '($count recenzí)';
  }

  @override
  String get tripDetails => 'Detaily jízdy';

  @override
  String get rideDetails => 'Detaily jízdy';

  @override
  String get orderARide => 'Objednat jízdu';

  @override
  String get noRidesYet => 'Zatím žádné jízdy!';

  @override
  String get issueSubjectPlaceholder => 'Zadejte předmět problému';

  @override
  String get issueContentPlaceholder => 'Zadejte popis problému';

  @override
  String get reportThisIssue => 'Nahlásit tento problém';

  @override
  String get fieldIsRequired => 'Toto pole je povinné';

  @override
  String get ok => 'OK';

  @override
  String get favoriteLocations => 'Oblíbená místa';

  @override
  String get favoriteLocationsSubtitle =>
      'Uložte si oblíbená místa pro snadnější přístup';

  @override
  String get createAFavoriteLocation => 'Vytvořit oblíbené místo';

  @override
  String get addressTitleLabel => 'Název adresy';

  @override
  String get clickToSetLocation => 'Klikněte pro nastavení lokace';

  @override
  String get whereIsYourNewFavoriteLocation =>
      'Kde je vaše nové oblíbené místo?';

  @override
  String get locateFavoriteLocationDescription =>
      'Použijte vyhledávací pole nebo mapu pro pinování přesného místa';

  @override
  String get searchLocation => 'Hledat místo';

  @override
  String get saveChanges => 'Uložit změny';

  @override
  String get rideHistory => 'Historie jízd';

  @override
  String get scheduledRides => 'Plánované jízdy';

  @override
  String get keepTheOrder => 'Udržet pořadí';

  @override
  String get cancelTheRide => 'Zrušit jízdu';

  @override
  String get walletBalance => 'Stav peněženky';

  @override
  String get activities => 'Aktivity';

  @override
  String get pleaseEnterGiftCardCode => 'Zadejte kód dárkové karty';

  @override
  String get redeem => 'Uplatnit';

  @override
  String get enterGiftCardCode => 'Zadejte kód dárkové karty';

  @override
  String get redeemGiftCard => 'Uplatnit dárkovou kartu';

  @override
  String get redeemGiftCardDescription =>
      'Zadejte kód dárkové karty pro její uplatnění.';

  @override
  String get redeemSuccessTitle => 'Dárková karta uplatněna!';

  @override
  String redeemSuccessDescription(String amount) {
    return 'Úspěšně jste uplatnili dárkovou kartu v hodnotě $amount.';
  }

  @override
  String get addCredit => 'Přidat kredit';

  @override
  String get payNow => 'Zaplatit nyní';

  @override
  String get addCreditToWallet => 'Přidat kredit do peněženky';

  @override
  String get pleaseSelectAmount => 'Vyberte částku';

  @override
  String get enterAmount => 'Zadejte částku';

  @override
  String get selectAmount => 'Vyberte částku:';

  @override
  String get wallet => 'Peněženka';

  @override
  String get totalRides => 'Celkové jízdy';

  @override
  String get appSettings => 'Nastavení aplikace';

  @override
  String get mapSettings => 'Nastavení mapy';

  @override
  String get lanugageSettings => 'Nastavení jazyka';

  @override
  String get paymentMethods => 'Platební metody';

  @override
  String get selectCards => 'Vyberte karty';

  @override
  String get selectCardsDescription =>
      'Můžete vybrat čísla karet, které chcete zobrazit v seznamu platebních metod na fakturách.';

  @override
  String get delete => 'Smazat';

  @override
  String get nameOnCard => 'Jméno na kartě';

  @override
  String get profile => 'Profil';

  @override
  String get scheduledRide => 'Plánovaná jízda';

  @override
  String get addPaymentMethod => 'Přidat platební metodu';

  @override
  String get addPaymentMethodDescription =>
      'Přidejte novou platební metodu do svého účtu';

  @override
  String get saveCard => 'Uložit kartu';

  @override
  String get selectDialCode => 'Vyberte kód oblasti';

  @override
  String get searchCountryName => 'Hledat název země';

  @override
  String get preferences => 'Preference:';

  @override
  String get onboardingDescription =>
      'Chvíli před registrací účtu a užíváním pohodlných jízd';

  @override
  String get signInSignUp => 'Přihlásit se/ Registrovat';

  @override
  String get enterOtp => 'Zadejte OTP';

  @override
  String get enterPassword => 'Zadejte heslo';

  @override
  String get enterPasswordDescription => 'Zadejte své heslo pro pokračování';

  @override
  String get setPassword => 'Nastavit heslo';

  @override
  String get password => 'Heslo';

  @override
  String get passwordRuleDescription => 'Zahrňte alespoň dvě z následujících:';

  @override
  String get passwordRuleLength => 'Mezi 9 a 64 znaky';

  @override
  String get passwordRuleUpperCase => 'Velká písmena';

  @override
  String get passwordRuleLowerCase => 'Malá písmena';

  @override
  String get passwordRuleNumber => 'Čísla';

  @override
  String get passwordRuleSpecialCharacter => 'Speciální znaky';

  @override
  String get contactDetails => 'Kontaktní údaje';

  @override
  String get vehicleDetails => 'Údaje o vozidle';

  @override
  String get payoutInformation => 'Informace o výplatě';

  @override
  String get documents => 'Dokumenty';

  @override
  String get accessDenied => 'Přístup odepřen';

  @override
  String get success => 'Úspěch';

  @override
  String get skipForNow => 'Přeskočit nyní';

  @override
  String get sendOtpDescription =>
      'Verifikační kód byl odeslán na vaše telefonní číslo';

  @override
  String get resendOtp => 'Znovu odeslat kód';

  @override
  String get useOtpInstead => 'Použít OTP místo';

  @override
  String get home => 'Domov';

  @override
  String get logout => 'Odhlásit se';

  @override
  String get driverLicenseNumber => 'Číslo řidičského průkazu';

  @override
  String get email => 'E-mail';

  @override
  String get address => 'Adresa';

  @override
  String get gender => 'Pohlaví';

  @override
  String get genderMale => 'Muž';

  @override
  String get genderFemale => 'Žena';

  @override
  String get genderUnknown => 'Neurčeno / Neznámé';

  @override
  String get vehiclePlateNumber => 'Číslo SPZ';

  @override
  String get vehicleColor => 'Barva vozidla';

  @override
  String get vehicleModelAndMake => 'Model a značka vozidla';

  @override
  String get vehicleProductionYear => 'Rok výroby vozidla';

  @override
  String get bankName => 'Název banky';

  @override
  String get bankRoutingNumber => 'Číslo směrovací banky';

  @override
  String get bankAccountNumber => 'Číslo bankovního účtu';

  @override
  String get bankSwift => 'SWIFT kód';

  @override
  String get uploadImage => 'Nahrát obrázek';

  @override
  String get yourBalance => 'Vaše rovnováha';

  @override
  String get rideCancellation => 'Zrušení jízdy';

  @override
  String get cancelRideMessage => 'Jste si jisti, že chcete zrušit svou jízdu?';

  @override
  String get cancelRideSuccess => 'Jízda byla úspěšně zrušena';

  @override
  String get confirmAndCancelRide => 'Potvrdit a zrušit jízdu';

  @override
  String get selectPaymentMethod => 'Vyberte platební metodu';

  @override
  String get rideFeePaid => 'Poplatek za jízdu byl zaplacen';

  @override
  String get rideFeeUnpaid => 'Poplatek za jízdu nebyl ještě zaplacen';

  @override
  String get total => 'Celkem';

  @override
  String get totalPrice => 'Celková cena';

  @override
  String get addCustomCredit => 'Přidat vlastní kredit';

  @override
  String get serviceFee => 'Poplatek za službu';

  @override
  String get serviceOptionFee => 'Poplatek za možnost služby';

  @override
  String get couponDiscount => 'Sleva na kupon';

  @override
  String get walletCreit => 'Kredit peněženky';

  @override
  String get custom => 'Vlastní';

  @override
  String get payment => 'Platba';

  @override
  String get cashPayment => 'Platba hotově';

  @override
  String cashPaymentDescription(String amount) {
    return 'Potvrzujete, že jste obdrželi $amount?';
  }

  @override
  String get cashPaymentReceived => 'Platba hotově přijata';

  @override
  String get confirmAndEndTrip => 'Potvrdit a ukončit jízdu';

  @override
  String get earnings => 'Příjmy';

  @override
  String get acceptOrder => 'Přijmout objednávku';

  @override
  String get canceled => 'Zrušeno';

  @override
  String get unknown => 'Neznámé';

  @override
  String get commission => 'Provize';

  @override
  String get selectProfileImage => 'Vyberte profilový obrázek';

  @override
  String get chooseAvatarDescription => 'Nebo vyberte avatar ze seznamu níže:';

  @override
  String get fullName => 'Celé jméno';

  @override
  String get favoriteDrivers => 'Oblíbení řidiči';

  @override
  String get distanceTraveled => 'Ujetá vzdálenost';

  @override
  String get rating => 'Hodnocení';

  @override
  String get map => 'Mapa';

  @override
  String get income => 'Příjem';

  @override
  String get timeSpent => 'Strávený čas';

  @override
  String get daily => 'Denní';

  @override
  String get monthly => 'Měsíční';

  @override
  String get noRecordsFoundEarnings =>
      'Pro tento filtr nebyl nalezen žádný záznam jízd';

  @override
  String get feedbacksSummaryEmptyStateHeading => 'Žádné zpětné vazby';

  @override
  String get feedbacksSummaryEmptyStateTitle =>
      'Nemáte dostatek zpětných vazeb na zobrazení.';

  @override
  String get feedbacksSummary => 'Souhrn zpětné vazby';

  @override
  String get feedbacksGoodTitle => 'Skvělá práce!';

  @override
  String get feedbacksGoodSubtitle => 'Vaše hodnocení vypadá dobře';

  @override
  String get feedbacksBadTitle => 'Průměr';

  @override
  String get feedbacksBadSubtitle => 'Můžete udělat nějaká zlepšení';

  @override
  String get feedbacksGoodPointsTitle => 'Některé dobré body o vás:';

  @override
  String get feedbacksbadPointsTitle =>
      'Některé body, které byste mohli zlepšit:';

  @override
  String get feedbacksReviewsTitle => 'Některé předchozí recenze';

  @override
  String get payoutMethods => 'Metody výplaty';

  @override
  String get notice => 'Upozornění:';

  @override
  String get payoutNoticeTitle =>
      'Bude vám automaticky vyplaceno dvakrát týdně od administrátora.';

  @override
  String get addPayoutMethod => 'Přidat metodu výplaty';

  @override
  String get navigate => 'Navigovat';

  @override
  String get noPayoutMethods => 'Žádné metody výplaty';

  @override
  String get name => 'Jméno';

  @override
  String get nameHint => 'Zadejte jméno';

  @override
  String get bankNameHint => 'Zadejte název banky';

  @override
  String get branchName => 'Název pobočky';

  @override
  String get branchNameHint => 'Zadejte název pobočky';

  @override
  String get accountHolderName => 'Jméno majitele účtu';

  @override
  String get routingNumber => 'Směrovací číslo';

  @override
  String get routingNumberHint => 'Zadejte směrovací číslo';

  @override
  String get accountNumber => 'Číslo účtu';

  @override
  String get accountNumberHint => 'Zadejte číslo účtu';

  @override
  String get addressHint => 'Zadejte adresu';

  @override
  String get dateOfBith => 'Datum narození';

  @override
  String get yearHint => 'Rok';

  @override
  String get monthHint => 'Měsíc';

  @override
  String get dayHint => 'Den';

  @override
  String get city => 'Město';

  @override
  String get cityHint => 'Zadejte město';

  @override
  String get state => 'Stát';

  @override
  String get stateHint => 'Zadejte stát';

  @override
  String get zipCode => 'PSČ';

  @override
  String get zipCodeHint => 'Zadejte PSČ';

  @override
  String get day => 'Den';

  @override
  String get month => 'Měsíc';

  @override
  String get year => 'Rok';

  @override
  String get noActivitiesYet => 'Žádné aktivity dosud.';

  @override
  String get headingToDestination => 'směrem k cíli';

  @override
  String get driverArrivedNotice => 'Řidič na vás čeká';

  @override
  String get driverShouldAriveInNotice => 'Řidič by měl dorazit za';

  @override
  String get driverShouldHaveArrivedNotice =>
      'Řidič by měl dorazit každou chvíli';

  @override
  String get deleteAccount => 'Smazat účet';

  @override
  String get deleteAccountNotice =>
      'Jste si jisti, že chcete smazat svůj účet? Po 30 dnech bude váš účet trvale smazán. Během této doby můžete svůj účet obnovit přihlášením se znovu.';

  @override
  String get confirmAndDeleteAccount => 'Potvrdit a smazat účet';

  @override
  String get accountDeleted => 'Účet byl smazán';

  @override
  String share_trip_text_locations(Object destination, Object pickup) {
    return 'Jsem na cestě do $destination z $pickup.';
  }

  @override
  String share_trip_text_driver(
      Object firstName, Object lastName, Object mobileNumber) {
    return 'Můj řidič je $firstName $lastName, mobilní číslo je +$mobileNumber.';
  }

  @override
  String share_trip_text_rider(
      Object firstName, Object lastName, Object mobileNumber) {
    return 'Cestující se mnou je $firstName $lastName, mobilní číslo je +$mobileNumber.';
  }

  @override
  String share_trip_started_time(Object startTime, Object duration) {
    return 'Cesta začala v $startTime a očekávám, že cesta bude trvat přibližně $duration minut';
  }

  @override
  String share_trip_not_arrived_time(Object duration) {
    return 'Očekávám, že cesta bude trvat přibližně $duration minut, jakmile nastoupím do auta řidiče.';
  }

  @override
  String get sendSOSMessage =>
      'DŮLEŽITÉ: Používejte tuto funkci pouze v případě nouze. Kontaktujeme úřady za vás.';

  @override
  String get confirmAndSendSOS => 'Potvrdit a odeslat SOS';

  @override
  String get sosSentSuccessfully => 'SOS byla úspěšně odeslána';

  @override
  String get topUpSuccess => 'Peněženka byla úspěšně doplněna';

  @override
  String get cancelNotAllowed => 'Zrušení již zahájené jízdy není možné.';

  @override
  String get error => 'Chyba';

  @override
  String get connectionError => 'Chyba připojení';

  @override
  String get serverError => 'Chyba serveru';

  @override
  String get addNewLocation => 'Přidat nové místo';

  @override
  String get twoWayTrip => 'Cesta tam a zpět';

  @override
  String get reportSubmitted => 'Hlášení odesláno';

  @override
  String get reportSubmittedDescription =>
      'Vaše hlášení bylo úspěšně odesláno, zkontrolujeme to a podnikneme nezbytné kroky.';

  @override
  String get cardNumber => 'Číslo karty';

  @override
  String get cardNumberHint => 'Zadejte číslo karty';

  @override
  String get expiryDate => 'Datum expirace';

  @override
  String get expiryDateHint => 'MM/RR';
  @override
  String get noFavoriteDrivers => 'Žádní oblíbení řidiči';

  @override
  String get noFavoriteDriversDescription =>
      'Můžete označit své oblíbené řidiče jako favority, když je ohodnotíte po jízdě.';

  @override
  String get pickupLocationNotFound =>
      'Nepodařilo se zjistit vaši aktuální polohu pomocí GPS jako místo vyzvednutí. Zadejte místo vyzvednutí ručně.';

  @override
  String get dragToSelect => 'Táhněte pro výběr';

  @override
  String get skip => 'Přeskočit';

  @override
  String get openSettings => 'Otevřít nastavení';

  @override
  String get locationPermission => 'Povolení polohy';

  @override
  String get locationPermissionDeniedForeverMessage =>
      'Povolení polohy je požadavkem pro přijímání objednávek ve vašem okolí a také pro sledování vaší polohy cestujícím. Bez tohoto povolení nemůžete přijímat objednávky a my nemůžeme sledovat vaši aktuální polohu. Toto povolení můžete změnit v nastavení vašeho telefonu.';

  @override
  String get allow => 'Povolit';

  @override
  String get driverOnlineTitle => 'Hledání jízdy';

  @override
  String get driverOfflineTitle =>
      'Připojte se online, abyste začali přijímat žádosti';

  @override
  String get payInCash => 'Platba hotově';

  @override
  String get payInCashDescription =>
      'Pokračujte v platbě hotově řidiči. Řidič potvrdí platbu, jakmile ji obdrží.';

  @override
  String get addToFavoriteDrivers => 'Přidat mezi oblíbené řidiče';

  @override
  String get slideToConfirmArrival => 'Posuňte pro potvrzení příjezdu';

  @override
  String get slideToConfirmPickup => 'Posuňte pro potvrzení vyzvednutí';

  @override
  String get slideToConfirmDropoff => 'Posuňte pro potvrzení vyložení';

  @override
  String get noticePickingUpRiderIn => 'Vyzvednutí cestujícího za:';

  @override
  String get noticeRiderNotified =>
      'Cestující byl informován, vyzvedněte cestujícího a začněte jízdu';

  @override
  String get adminPanelOnboardingOneTitle => 'Vítejte v lepším systému';

  @override
  String get adminPanelOnboardingOneSubtitle =>
      'Uvolněte sílu vašeho Q-commerce';

  @override
  String get adminPanelOnboardingTwoTitle => 'Zjednodušte své operace';

  @override
  String get adminPanelOnboardingTwoSubtitle =>
      'Převezměte kontrolu s naším centralizovaným super panelem';

  @override
  String get rider => 'Cestující';

  @override
  String get customer => 'Zákazník';

  @override
  String get back => 'Zpět';

  @override
  String get addressHome => 'Domov';

  @override
  String get addressWork => 'Práce';

  @override
  String get addressPartner => 'Partner';

  @override
  String get addressGym => 'Posilovna';

  @override
  String get addressParent => 'Rodič';

  @override
  String get addressCafe => 'Kavárna';

  @override
  String get addressPark => 'Park';

  @override
  String get addressOther => 'Jiné';
}
