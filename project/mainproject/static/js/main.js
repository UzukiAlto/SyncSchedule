// 編集ボタンを取得
const homeEditButton = document.getElementById('home-edit-button');
// 時間割グリッドの要素を取得
const timetableGrid = document.querySelector('.timetable-grid');
// 編集ボタンを押したときに表示・非表示を切り替える要素を取得
const homeEditItems = document.querySelectorAll('.home-edit-display');
const timeFlameTexts = document.querySelectorAll('.time-frame-text');

const classContentItems = document.querySelectorAll('.class-content.card-body.btn');
const disabledCard = document.querySelectorAll('.disabled-card');

// htmlの<body>にあるdata属性からデータを取得
// 現在の編集モード
let isEditing = document.body.dataset.isEditing === "true";
// 時間割の行・列数
let timetableRow = parseInt(document.body.dataset.timetableRow);
const timetableRowMax = 8;
let timetableColumn = parseInt(document.body.dataset.timetableColumn);
const timetableColumnMax = 7;

// 編集用の要素を表示
const enableEditContents = () => {
    homeEditItems.forEach((item) => {
        item.style.display = 'block';
    });
    timeFlameTexts.forEach((item) => {
        item.classList.add('hide-content');
    });
    classContentItems.forEach((item) => {
        item.classList.add('btn-disabled');
    });
    disabledCard.forEach((item) => {
        item.classList.remove('disabled-card');
    });
    timetableGrid.style.gridTemplateRows = `50px repeat(${timetableRowMax}, 1fr)`;
    timetableGrid.style.gridTemplateColumns = `repeat(${timetableColumnMax}, 1fr)`;
};

// 編集用の要素を非表示
const disableEditContents = () => {
    
    // 初期表示時のグリッド設定
    timetableGrid.style.gridTemplateRows = `50px repeat(${timetableRow}, 1fr)`;
    timetableGrid.style.gridTemplateColumns = `repeat(${timetableColumn}, 1fr)`;
    
    homeEditItems.forEach((item) => {
        item.style.display = 'none';
    });
    timeFlameTexts.forEach((item) => {
        item.classList.remove('hide-content');
    });
    classContentItems.forEach((item) => {
        item.classList.remove('btn-disabled');
    });
    disabledCard.forEach((item) => {
        item.classList.add('disabled-card');
    })
};




// 初期表示時に編集モードかどうかを判定
if (isEditing) {
    enableEditContents();
}else {
    disableEditContents();
}

// 編集ボタンがクリックされたときに要素の表示とグリッドの設定を切り替える
const displayHomeEdit = () => {
    isEditing = !isEditing;
    if (isEditing == true){
        // ボタンのテキストを切り替え
        homeEditButton.textContent = "編集完了";
        enableEditContents();

    } else {
        // ボタンのテキストを切り替え
        homeEditButton.textContent = "授業編集";
        disableEditContents();
    }
};

// 編集ボタンにクリックイベントを追加
homeEditButton.addEventListener("click", displayHomeEdit);

// 各時間枠のフォームに変更があったとき、自動で送信してデータを更新
document.querySelectorAll('.time-frame-form').forEach((form) => {
    form.addEventListener("change", async (event) => {
        try {
            form = event.currentTarget;
            // formが全て入力済みかチェック
            if (!form.checkValidity()) {
                return;
            }
            const response = await fetch('/edit/time_frame/', {
                method: 'POST',
                body: new FormData(form)
            })
            const data = await response.json();
            if (data.status === 'success') {
                const formId = Number(form.dataset.id);
                const timeFrameText = document.getElementById(`time-frame-text-${formId}`);
                timeFrameText.innerText = `${data.new_start_time} - ${data.new_end_time}`;
            } else {
                console.error('Error: ', data.message);
            }
        } catch(error) {
            console.error('Error:', error);
        }
    })
})
