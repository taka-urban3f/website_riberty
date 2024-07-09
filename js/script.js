'use strict';

//ローディング画面の最小表示時間をミリ秒で設定
const minLoadingTime = 1000;

//ローディング時間の計測に使用
const date = new Date();
const loadingStart = date.getTime();

///////////////////////////////////////////////////////////////////////////////////
//-----------------ローディング画面ではスクロール不可にする処理-----------------
function noscroll(e) {
    e.preventDefault();
}

document.addEventListener('touchmove', noscroll, {
    passive: false
});
document.addEventListener('wheel', noscroll, {
    passive: false
});

///////////////////////////////////////////////////////////////////////////////////
//-----------------ハンバーガーボタンをクリックした時の処理-----------------
let menu_open = 0;

document.querySelector('.c-humBtn').addEventListener('click', function () {
    if (menu_open == 0) {
        document.querySelector('.c-humBtn').classList.add('c-humBtn--open');
        document.querySelector('.l-menu').classList.add('l-menu--open');
        document.querySelector('body').style.overflow = 'hidden';
        document.querySelector('.c-humBtn__text').textContent = '閉じる';

        menu_open = 1;
    } else {
        document.querySelector('.c-humBtn').classList.remove('c-humBtn--open');
        document.querySelector('.l-menu').classList.remove('l-menu--open');
        document.querySelector('body').style.overflow = null;
        document.querySelector('.c-humBtn__text').textContent = 'メニュー';
        menu_open = 0;
    }
});

///////////////////////////////////////////////////////////////////////////////////
//-----------------「トップへ戻る」ボタンの表示・非表示処理-----------------
function doWhenIntersect(entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting == false) {
            document.querySelector('.p-topBtn').classList.add('p-topBtn--show');
        } else {
            document.querySelector('.p-topBtn').classList.remove('p-topBtn--show');
        }
    });
}

const options = {
    root: null,
    rootMargin: "0px 0px",
    threshold: 0
};

const io = new IntersectionObserver(doWhenIntersect, options);

//.l-headerを監視対象に設定
io.observe(document.querySelector('.l-header'));

///////////////////////////////////////////////////////////////////////////////////
//-----------------テキストアニメーションの処理-----------------

/*animation-delayの値は、u-textAnime__unit要素を跨いで累積される（index_accum変数を使用）。
delay値を累計させたいu-textAnime__unit要素達を包含する要素にu-textAnimeを付与する。
u-textAnime要素にデータ属性として全体の開始ディレイタイムと
それぞれの文字のディレイタイムを設定。単位は秒（data-ta-base-del, data-ta-each-del）*/
const ta_elems = document.querySelectorAll('.u-textAnime');
if (ta_elems.length >= 1) {
    for (const ta_elem of ta_elems) {
        const base_del = parseFloat(ta_elem.dataset.taBaseDel);
        const each_del = parseFloat(ta_elem.dataset.taEachDel);
        const unit_elems = ta_elem.querySelectorAll('.u-textAnime__unit');
        if (unit_elems.length >= 1) {
            let index_accum = 0;
            for (const unit_elem of unit_elems) {
                const origin_text = unit_elem.textContent;
                const each_text = origin_text.split('');
                let html = '';

                each_text.forEach(function (t, i) {
                    html += `<span class="u-textAnime__eachText" style="animation-delay:${(index_accum + i) * each_del + base_del}s">${t}</span>`;
                });

                index_accum += each_text.length;

                unit_elem.innerHTML = '';
                unit_elem.insertAdjacentHTML('beforeend', html);
            }
        }
    }
}

function textAnimWhenIntersect(entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('u-textAnime--appear');
        }
    });
}

const ta_options = {
    root: null,
    rootMargin: "-200px 0px",
    threshold: 0
};

const ta_io = new IntersectionObserver(textAnimWhenIntersect, ta_options);

//u-textAnimeを監視対象に設定。ローディング画面を消す時（loadイベント時）に呼び出す。
function start_observe() {
    if (ta_elems.length >= 1) {
        for (const ta_elem of ta_elems) {
            ta_io.observe(ta_elem);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////
//-----------------htmlファイルと外部リソースの読み込みが完了したら実行する処理-----------------
window.addEventListener('load', function () {
    const date = new Date();
    const loadedTime = date.getTime();
    const shortageTime = loadingStart + minLoadingTime - loadedTime;

    //loadが完了してなおかつ最小ローディング時間を経過していれば直ちに、
    //最小ローディング時間を経過していない場合、残り時間経過後に実行する処理。
    //スクロール可能にする・ローディング画面を消す・テキストアニメーションの監視対象を監視開始
    if (shortageTime <= 0) {
        document.removeEventListener('touchmove', noscroll);
        document.removeEventListener('wheel', noscroll);
        
        document.querySelector('.l-loading').classList.add('l-loading--hide');
        start_observe();        
    } else {
        setTimeout(function () {
            document.removeEventListener('touchmove', noscroll);
            document.removeEventListener('wheel', noscroll);

            document.querySelector('.l-loading').classList.add('l-loading--hide');
            start_observe();            
        }, shortageTime);
    }
});