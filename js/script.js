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

//.l-header要素が画面外にある時だけボタンを表示させる
function WhenIntersect_header(entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting == false) {
            document.querySelector('.p-topBtn').classList.add('p-topBtn--show');
        } else {
            document.querySelector('.p-topBtn').classList.remove('p-topBtn--show');
        }
    });
}

//監視オブジェクト作成
const io_h = new IntersectionObserver(WhenIntersect_header, {
    root: null,
    rootMargin: "0px 0px",
    threshold: 0
});

//.l-headerを監視対象に設定
io_h.observe(document.querySelector('.l-header'));

///////////////////////////////////////////////////////////////////////////////////
//-----------------テキストアニメーションの為の処理-----------------

/*u-textAnime*__unit要素内のテキストを一文字づつspanタグで囲み、それぞれanimation-delayプロパティを値をずらしながら設定する。
元々u-textAnime*__unit要素内にあったテキスト等は消去する。
animation-delayの値は、u-textAnime*__unit要素を跨いで累積される（index_accum変数を使用）。
delay値を累計させたいu-textAnime*__unit要素達を包含する要素にu-textAnime*を付与する。
u-textAnime*要素にデータ属性として全体の開始ディレイタイムと
それぞれの文字のディレイタイムを設定。単位は秒（data-ta-base-del, data-ta-each-del）*/
function generat_span(className) {
    const elems_ta = document.querySelectorAll('.' + className);
    if (elems_ta.length >= 1) {
        for (const elem_ta of elems_ta) {
            const base_del = parseFloat(elem_ta.dataset.taBaseDel);
            const each_del = parseFloat(elem_ta.dataset.taEachDel);
            const unit_elems = elem_ta.querySelectorAll('.' + className + '__unit');
            if (unit_elems.length >= 1) {
                let index_accum = 0;
                for (const unit_elem of unit_elems) {
                    const origin_text = unit_elem.textContent;
                    const each_text = origin_text.split('');
                    let html = '';

                    each_text.forEach(function (t, i) {
                        html += `<span class="${className}__eachText" style="animation-delay:${(index_accum + i) * each_del + base_del}s">${t}</span>`;
                    });

                    index_accum += each_text.length;

                    unit_elem.innerHTML = '';
                    unit_elem.insertAdjacentHTML('beforeend', html);
                }
            }
        }
    }
}

generat_span('u-textAnime1');
generat_span('u-textAnime2');

//u-textAnime*要素が画面内に入ったらアニメーション用のクラスを付与
function WhenIntersect_textAnim(entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            if (entry.target.classList.contains('u-textAnime1')) {
                entry.target.classList.add('u-textAnime1--do');
            } else if (entry.target.classList.contains('u-textAnime2')) {
                entry.target.classList.add('u-textAnime2--do');
            }
        }
    });
}

//監視オブジェクト作成 （アニメーションの種類によってタイミングは違う）
const io_ta1 = new IntersectionObserver(WhenIntersect_textAnim, {
    root: null,
    rootMargin: "-200px 0px",
    threshold: 0
});

const io_ta2 = new IntersectionObserver(WhenIntersect_textAnim, {
    root: null,
    rootMargin: "0px 0px",
    threshold: 0
});

//u-textAnime*を監視対象に設定。ローディング画面を消す時（loadイベント時）に呼び出す。
function start_observe_ta() {
    let elems_ta;
    elems_ta = document.querySelectorAll('.u-textAnime1');
    if (elems_ta.length >= 1) {
        for (const elem_ta of elems_ta) {
            io_ta1.observe(elem_ta);
        }
    }

    elems_ta = document.querySelectorAll('.u-textAnime2');
    if (elems_ta.length >= 1) {
        for (const elem_ta of elems_ta) {
            io_ta2.observe(elem_ta);
        }
    }
}

///////////////////////////////////////////////////////////////////////////////////
//-----------------アニメーションの為のクラスを付与-----------------
function WhenIntersect_swayAnim(entries) {
    entries.forEach(function (entry) {
        if (entry.isIntersecting) {
            entry.target.classList.add('u-swayAnime--do');
        }
    });
}

//監視オブジェクト作成
const io_sa = new IntersectionObserver(WhenIntersect_swayAnim, {
    root: null,
    rootMargin: "-200px 0px",
    threshold: 0
});

//u-swayAnimeを監視対象に設定。ローディング画面を消す時（loadイベント時）に呼び出す。
function start_observe_sa() {
    const elems_sa = document.querySelectorAll('.u-swayAnime');
    for (const elem_sa of elems_sa) {
        io_sa.observe(elem_sa);
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
    //スクロール可能にする・ローディング画面を消す・アニメーション要素等の監視対象を監視開始
    if (shortageTime <= 0) {
        document.removeEventListener('touchmove', noscroll);
        document.removeEventListener('wheel', noscroll);

        document.querySelector('.l-loading').classList.add('l-loading--hide');

        start_observe_ta();
        start_observe_sa()
    } else {
        setTimeout(function () {
            document.removeEventListener('touchmove', noscroll);
            document.removeEventListener('wheel', noscroll);

            document.querySelector('.l-loading').classList.add('l-loading--hide');

            start_observe_ta();
            start_observe_sa()
        }, shortageTime);
    }
});