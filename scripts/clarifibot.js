const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");
const fs = require("fs");

const stub = ClarifaiStub.grpc();

const metadata = new grpc.Metadata();
const api_key = "093c76d5533841efbadadaa56ed89a13";
metadata.set("authorization", "Key " + api_key);

// キャラクターとそれに対応するデータのマッピング
const characterData = {
  ChinaKuramoto: {
    name: "倉本 千奈",
    age: 15,
    bloodType: "O型",
    birthday: "8月1日",
    height: 148,
    weight: 43,
    hobby: "お絵描き",
    specialty: "元気なあいさつ、動物に好かれること",
    threesize: { bust: 73, waist: 56, hip: 73 },
    zodiac: "しし座",
    dominantHand: "右",
    birthplace: "神奈川県",
    cv: "伊藤 舞音"
  },
  HiroShinosawa: {
    name: "篠澤 広",
    age: 15,
    bloodType: "AB型",
    birthday: "12月21日",
    height: 159,
    weight: 41,
    hobby: "苦手分野に挑戦すること、観葉植物を育てること",
    specialty: "学業全般、物理、数学、パズル",
    threesize: { bust: 72, waist: 54, hip: 76 },
    zodiac: "いて座",
    dominantHand: "左",
    birthplace: "秋田県",
    cv: "川村 玲奈"
  },
  KotoneFujita: {
    name: "藤田 ことね",
    age: 15,
    bloodType: "O型",
    birthday: "4月29日",
    height: 156,
    weight: 40,
    hobby: "お金を稼ぐこと",
    specialty: "ダンス、人の顔と名前を覚えること",
    threesize: { bust: 75, waist: 55, hip: 75 },
    zodiac: "おうし座",
    dominantHand: "右",
    birthplace: "埼玉県",
    cv: "飯田 ヒカル"
  },
  LiliyaKatsuragi: {
    name: "葛城 リーリヤ",
    age: 15,
    bloodType: "B型",
    birthday: "7月24日",
    height: 161,
    weight: 43,
    hobby: "お菓子作り、日本のアニメ",
    specialty: "お菓子作り、ゲーム",
    threesize: { bust: 82, waist: 53, hip: 80 },
    zodiac: "しし座",
    dominantHand: "右",
    birthplace: "スウェーデン",
    cv: "花岩 香奈"
  },
  MaoArimura: {
    name: "有村 麻央",
    age: 17,
    bloodType: "A型",
    birthday: "1月18日",
    height: 157,
    weight: 46,
    hobby: "他人の面倒を見ること、観劇",
    specialty: "格闘技、手先が器用",
    threesize: { bust: 85, waist: 53, hip: 85 },
    zodiac: "やぎ座",
    dominantHand: "右",
    birthplace: "兵庫県",
    cv: "七瀬 つむぎ"
  },
  RinamiHimesaki: {
    name: "姫崎 莉波",
    age: 17,
    bloodType: "A型",
    birthday: "3月5日",
    height: 166,
    weight: 56,
    hobby: "カフェ巡り、コスメ集め",
    specialty: "料理、裁縫・手芸",
    threesize: { bust: 90, waist: 59, hip: 93 },
    zodiac: "うお座",
    dominantHand: "右",
    birthplace: "福岡県",
    cv: "薄井 友里"
  },
  SakiHanami: {
    name: "花海 咲季",
    age: 16,
    bloodType: "A型",
    birthday: "4月2日",
    height: 152,
    weight: 45,
    hobby: "勝負ごと全般",
    specialty: "運動全般、家事全般、マッサージ",
    threesize: { bust: 84, waist: 55, hip: 80 },
    zodiac: "おひつじ座",
    dominantHand: "左",
    birthplace: "愛知県",
    cv: "長月 あおい"
  },
  SumikaShiun: {
    name: "紫雲 すみか",
    age: 15,
    bloodType: "O型",
    birthday: "11月11日",
    height: 168,
    weight: 54,
    hobby: "カラオケ、SNS",
    specialty: "身体がやわらかい",
    threesize: { bust: 89, waist: 58, hip: 85 },
    zodiac: "さそり座",
    dominantHand: "左",
    birthplace: "北海道",
    cv: "湊 みや"
  },
  TemariTsukimura: {
    name: "月村 手毬",
    age: 15,
    bloodType: "AB型",
    birthday: "6月3日",
    height: 162,
    weight: 51,
    hobby: "美味しいものを食べること（封印中）",
    specialty: "歌",
    threesize: { bust: 82, waist: 58, hip: 86 },
    zodiac:"ふたご座",
    dominantHand: "右",
    birthplace: "京都府",
    cv: "小鹿 なお"
  },
  UmeHanami: {
    name: "花海 佑芽",
    age: 15,
    bloodType: "AB型",
    birthday: "4月1日", 
    height: 158,
    weight: 50,
    hobby: "お姉ちゃんとの勝負",
    specialty: "スポーツ全般、マッサージ",
    threesize: { bust: 91, waist: 60, hip: 85 },
    zodiac: "おひつじ座",
    dominantHand: "右",
    birthplace: "愛知県",
    cv: "松田 彩音"
  }
};

module.exports = (robot) => {
  const onfile = (res, file) => {
    res.download(file, (path) => {
      const imageBytes = fs.readFileSync(path, { encoding: "base64" });
      
      stub.PostModelOutputs(
        {
          model_id: "Gakuen-Idol-Maseter-Character-1",
          inputs: [{ data: { image: { base64: imageBytes } } }]
        },
        metadata,
        (err, response) => {
          if (err) {
            res.send("エラー: " + err);
            return;
          }

          if (response.status.code !== 10000) {
            res.send("エラーステータス: " + response.status.description + "\n" + response.status.details + "\n" + response.status.code);
            return;
          }

          // 最も確率の高い結果を取得
          const topConcept = response.outputs[0].data.concepts.reduce((prev, current) => 
            (prev.value > current.value) ? prev : current
          );

          // 対応するキャラクターデータを取得
          const characterInfo = characterData[topConcept.name];

          if (characterInfo) {
            res.send(`認識結果: ${topConcept.name} (確率: ${(topConcept.value * 100).toFixed(2)}%)\n` +
                     `名前: ${characterInfo.name}\n` +
                     `年齢: ${characterInfo.age}歳\n` +
                     `血液型: ${characterInfo.bloodType}\n` +
                     `誕生日: ${characterInfo.birthday}\n` +
                     `星座: ${characterInfo.zodiac || "不明"}\n` +
                     `身長: ${characterInfo.height}cm\n` +
                     `体重: ${characterInfo.weight}kg\n` +
                     `趣味: ${characterInfo.hobby}\n` +
                     `特技: ${characterInfo.specialty}\n` +
                     `スリーサイズ: B${characterInfo.threesize.bust} W${characterInfo.threesize.waist} H${characterInfo.threesize.hip}\n` +
                     `利き手: ${characterInfo.dominantHand || "不明"}\n` +
                     `出身地: ${characterInfo.birthplace || "不明"}\n` +
                     `CV: ${characterInfo.cv || "不明"}`);
          } else {
            res.send(`認識結果: ${topConcept.name} (確率: ${(topConcept.value * 100).toFixed(2)}%)\n` +
                     `このキャラクターの詳細情報は利用できません。`);
          }
        }
      );
    });
  };

  robot.respond('file', (res) => {
    onfile(res, res.json);
  });
};