exports.prefix = "o!"
exports.sahip = "208196116078919680" // KALDIRILACAK
exports.durum = "dnd" // AKTİF DEĞİL
exports.oynuyor = "www.olymposweb.com" // KALDIRILACAK
exports.sunucu = "606027252362379294" // olympos: 606027252362379294 // test: 667115809449050150
exports.renk = "2f3136"
exports.sahipIDs = [
    "208196116078919680", // jamie
    "133191597683638273" // ria
]
exports.ourBotsIDs = [
    "701779351447797851", // olyguard i
    "701801762612445296", // olyguard ii
    "701801997468172309", // olyguard iii
    "689196547527016545", // olympos destek
    "696775249370415135", // town of olympos (enes)
    "697470950207258654", // town of olympos (hasan)
]
exports.perms = { // BU HAZIR AYARLAR KOMUT KULLANIM YETKİSİ BELİRLERKEN HIZ KAZANMAK İÇİN HAZIRLANMIŞTIR!
    bot: [
        "✧ OLYMPOS", "✧ OLYMPOS v2", "✧ olyguard I", "✧ olyguard II", "✧ olyguard III", "✧ Town of Olympos", "Town of Olympos"
    ],
    üst: [ // en üst komutlar için sadece en üst düzey yetkililer !!
        "Zeus", "POSEIDON"
    ],
    üstyönetim: [ // üst düzey komutlar için üst düzey yetkililer
        "Zeus", "POSEIDON", "Hera", "Hades"
    ],
    vipüstü: [ // vip rollerinin üstünde bulunan yetkililer
        "Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena"
    ], 
    yetkili: [ // tüm yetkili roller
        "Zeus", "POSEIDON", "Hera", "Hades", "Demeter", "Athena", "Ares", "Hephaistos", "Aphrodite", "Hermes", "Hestia", "Dionysos"
    ],
    yetkisizAraRoller: [ // Yetki sıralaması yaparken gözardı edilecek roller !!
        "Ayın En İyileri", "✧", "Kratos", "Golden VIP", "Silver VIP", "Bronze VIP", "VIP", "🎂  Doğum Günün Kutlu Olsun", "olympos team"
    ],
    vip: [ // Tüm vip rolleri || Doğum günü sisteminde yaş arttırma yaparken nick değiştirme yapılır, bunu engellemek için bu roller gözardı edilir.
        "Golden VIP", "Silver VIP", "Bronze VIP", "VIP"
    ],
    kayıtlı: [ // Sadece kayıtlı üyelerin kullanabileceği komutlar için 
        "Elite of Olympos", "Rebel of Olympos", "Apollo", "Artemis"
    ],
    taglı: [ // Sadece taglı üyelerin kullanabileceği komutlar için 
        "Elite of Olympos"
    ],
    kayıtsız: [ // Sadece kayıtsız üyelerin kullanabileceği komutlar için 
        "Peasant of Olympos"
    ],
    herkes: [ // Kayıtlı veya kayıtsız herkesin kullanabileceği komutlar için
        "@everyone"
    ],
    sıralamaDışı: [ // rank sıralamalarında bulunmayacak roller
        "Zeus", "POSEIDON", "Hera", "Hades"
    ],
}
exports.roles = {
    booster: "Olympos Booster"
}
exports.dgRolü = "🎂  Doğum Günün Kutlu Olsun" // TODO: üstteki roles kısmına alınacak
exports.ranks = {
    ses: {
        googleTablo: '10553u-OEUzoXMItIu35GZolwuhKfpbABQvj4QydfCmI',
        headers: ["#", "Kullanıcı Adı", "XP", "Level"],
        varsayılan: { // Rank kaydı başlangıç değerleri
            expCurrent: 0,
            expMax: 100, // !! Levellerin expMax değerleri bu değere göre hesaplanır.
            level: 2, // Bu değer değiştirelecekse 'voiceStateUpdate.js' dosyasında düzenlenmesi gereken yerler var !!
        },
        logKanalları: {
            level: "levels",
        },
        logMesajları: {
            level: {
                toplam: "Tebrikler <@{0}>, **ses** kategorisinde **toplamda** {1}. seviyeye ulaştın!",
                aylık: "Tebrikler <@{0}>, **ses** kategorisinde **bu ay** {1}. seviyeye ulaştın!",
            }
        },
        saniyeBaşıExp: 0.003, // devirli yaz devirden sonrası 0 olmasın 5.0 olmaz 5.1 veya 5.001
        saniyeBaşıExpMax: 0.005, // devirli yaz devirden sonrası 0 olmasın 5.0 olmaz 5.1 veya 5.001
        minKişiSayısı: 2,  // Rank kaydı başlaması için ses kanalında bulunması gereken minimum kişi sayısı || Tek başına kayıt yapılmasın => 2
    },
    mesaj: {
        googleTablo: '1lHW_JUlRnnz53mO_Gio2jcTCSowo7lIW8P1SHcwE1bE',
        headers: ["#", "Kullanıcı Adı", "XP", "Level"],
        varsayılan: { // Rank kaydı başlangıç değerleri
            expCurrent: 0,
            expMax: 100, // !! Levellerin expMax değerleri bu değere göre hesaplanır.
            level: 2, // Bu değer değiştirelecekse 'voiceStateUpdate.js' dosyasında düzenlenmesi gereken yerler var !!
        },
        logKanalları: {
            level: "levels",
        },
        logMesajları: {
            level: {
                toplam: "Tebrikler <@{0}>, **mesaj** kategorisinde **toplamda** {1}. seviyeye ulaştın!",
                aylık: "Tebrikler <@{0}>, **mesaj** kategorisinde **bu ay** {1}. seviyeye ulaştın!",
            }
        },
        harfBaşıExp: 0.05, // devirli yaz devirden sonrası 0 olmasın 5.0 olmaz 5.1 veya 5.001 
        harfBaşıExpMax: 0.10, // devirli yaz devirden sonrası 0 olmasın 5.0 olmaz 5.1 veya 5.001
        maxHarfSayısı: 36,  // Her mesajda puan kazandıracak maksimum harf sayısı
        cooldown: 12 // Kaç saniyede bir puan kasılabilir ?
    },
    oyun: {
        googleTablo: '12xMiQhD1rrh0WlX_JJyzrbr-tyypt-l4ThEKeONIsAM',
        headers: ["#", "Kullanıcı Adı", "XP", "Level"],
        varsayılan: { // Rank kaydı başlangıç değerleri
            expCurrent: 0,
            expMax: 100, // !! Levellerin expMax değerleri bu değere göre hesaplanır.
            level: 2, // Bu değer değiştirelecekse 'voiceStateUpdate.js' dosyasında düzenlenmesi gereken yerler var !!
        },
        logKanalları: {
            level: "levels",
        },
        logMesajları: {
            level: {
                toplam: "Tebrikler <@{0}>, **oyun** kategorisinde **toplamda** {1}. seviyeye ulaştın!",
                aylık: "Tebrikler <@{0}>, **oyun** kategorisinde **bu ay** {1}. seviyeye ulaştın!",
            }
        },
        exps: {
            başlat: 5,
            günlük: 2,
            bitir: 20,
            kaçak: -20,
        },
    },
},
    exports.client_secret = {
        "type": process.env.TYPE,
        "project_id": process.env.PROJECT_ID,
        "private_key_id": process.env.PRIVATE_KEY_ID,
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC9vRl9AO97VuWn\nbiccMEv/igJi9h1g9Cr9Gblk98g4FQHS+AbIbxRBztOjdvOd3XxAVYrKb19R07lF\nsKm0yCL2epDFaDXQSG/b+6nqczXL9kG7WI40V6HM7T3TmpiBFLG2t/ZEIs9gmoGE\nTupFWJZbQuIb3+2UqdFau3mzTzmDeMDImsyIC5xxuMaZhHCWw9jSMnJSfhyRaWjF\nySssNFv7Db4QHzp++BVUWmZWR59sIcnEnSgeSaq1E2r/teI8j7CVrR02njxGfgFw\nRzrYmfRnh6yEcxiwee0IdApO1c7YxuUQXufEsYzZnHnrZQYlF3xcPf7PcjU/qBjQ\nBvkc/mXbAgMBAAECggEAEEC5BLYGTZSUJ9iYiA0eYsgsdn6qOz+0c6l28eOvERgX\nkmia6CNqYvgNCqUUrt1QmJAwoIY+w4XKiozcqfbfgSk0P9IH6LdebEPCpSnI82zn\nlN0759bpLg0qbSGtK5gdYE9MzJRbcDp78AdJ1mEwFqbZiIAQ3ARZ7Gw/u1uEy91E\n5vBHm5J+FQIILsB8I6CFgPIvuNlR/EI0C9lnlEKsupsr5LsmLR3gm9tw0/rM7Dm1\nEmS4u25+cqJrrDoqwY8kXxHrWI+//bgFfPwGuaNPHyt8hI19gpU/r5u3QRR10h7S\ngNI7KERVEStcOHGLq8XECKfBqEXg8Xml01ckLKDneQKBgQD6XMxSrXU8NphG8njG\nL74lJkZmWLKK3B4gOOvEEZHQP5hiljaxombOMXaP+uywHOqXJjw0It6RIyw4jtsu\ntY3JCuvmfm6fseNN+NTzx4q1p6z1z2G6svfUKxAtiZsD61rmOgOGpJNw6TnipS4T\nRxpjyP0sqObvrDGN/KZc1SMsMwKBgQDCAtam2q5/7oLQj0eLqW0XCf1UaZAY1HBh\nsnkmm7Lk/gTAb2FIzU2/LAIQEcGDNaZkMM6x/VLE8VC6X2GH6Bz44j5RbX5kx9wn\nGr7Fu5+R73Ugo1vctsDHjlYmcQv+prXCEQz/rrTxslULbjuvoNMVOiJl4C/I9/cE\nz4SY2xm3uQKBgHyNhijrmpNmJcPGBUezoMkijYuFPO3QLDyjlMdqZjxQJyOEz5j3\nzmVuPinLD81d1Wd04iad4lQaR3mruGc4c109TbbR138jJI456NeOwfc1f9qaXWhg\neOLYuaet+aytff9jhTWK0r8tiFq1CoMUsJBMAYgiTyGVbOHSe4Fbl6/5AoGAR0IR\noxE4/IYXCBFIHvTou4iQwltPcL8+U7PgqZyQVWkzR5bhLYMyph+81jgfUlj3N19x\n25AGwY08sGduBCPt2EAI0ZGc1dlOdBJvtWKXVluUMputluCM5/7Qh6gH1s1WfuQS\nWSrLDOcKM3uWcohoXyiOD8sK4g6pbNvngNkglgkCgYEAirvRV+7rGVX80yyut4bj\nqrZ4i7PAQBtL65MELyZW3y5tE2DpzRO3k43kXzmrpHdBVQCWCR+8eO4LP0z4TtME\n0yolHXMKOP8gewpMLb+UJZ6XwVdr42NOr1PSz1/nbsR9sogzO8wZ55otLVRFT/Ot\n9CJxJW/8CpDMKM2eeI+x0gs=\n-----END PRIVATE KEY-----\n",
        "client_email": process.env.CLIENT_EMAIL,
        "client_id": process.env.CLIENT_ID,
        "auth_uri": process.env.AUTH_URI,
        "token_uri": process.env.TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.CLIENT_X509_CERT_URL
    }

exports.atatürk = [
    "https://i.pinimg.com/originals/de/1a/54/de1a541dcb7e3644d89aa67b6c5f7e17.gif",
    "https://media1.tenor.com/images/9bc96af34563931baaa6e3f071e4fc31/tenor.gif?itemid=12248775",
    "https://66.media.tumblr.com/df0841292ade369b129a259af93a6a12/tumblr_oyjx7okHZK1st7nhfo1_r3_400.gif",
    "https://galeri14.uludagsozluk.com/769/ataturk-ders-kitaplarindan-cikarilsin_1903882.gif",
    "https://galeri13.uludagsozluk.com/692/29-ekim-cumhuriyet-bayrami_1755033.gif",
    "https://25.media.tumblr.com/ca4309db9e3f0868fe07d98be1f16110/tumblr_mi62qrmpue1s04h99o5_250.gif",
    "https://i.hizliresim.com/o3WO3R.gif",
    "https://i.pinimg.com/originals/b6/07/0c/b6070c377f8e43dc37adf0d1f97e42fc.gif",
    "https://i.pinimg.com/originals/d9/cb/a5/d9cba52f56cb34d3118c74dbb02ee647.gif",
    "https://66.media.tumblr.com/baf0ccc9f09a41df6726d48c1dff973c/tumblr_pdyox3Pdem1slenbbo2_250.gif",
    "https://i.pinimg.com/originals/6b/fa/3a/6bfa3a49c1158418952a749d2cb3ca0f.gif",
]