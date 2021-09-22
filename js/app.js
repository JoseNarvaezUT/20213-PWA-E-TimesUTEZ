var url = window.location.href;
var swLocation = '/20213-PWA-E-TimesUTEZ/sw.js';
let service = 'http://192.168.52.249:8081/api/';

let page = 0;
let notices = [];

let title = $('#title');
let initialDescription = $('#initialDescription');
let banner = $('#banner');
let datPublic = $('#datPublic');
let hashTag = $('#hashTag');
let description = $('#description');

if (navigator.serviceWorker) {
    if (url.includes('localhost')) {
        swLocation = '/sw.js'
    }
    navigator.serviceWorker.register(swLocation);
}

let getNotices = async () => {
    await fetch(service + 'notice/page/' + page)
        .then(res => res.json())
        .then(response => {

            console.log(response);
            page = response.pageable.pageSize;
            let notices = response.content;
            notices.forEach(notice => {

                $('#notices').append(`<div class="row border-bottom border-top border-success">
        <div class="col-12">
            <img id='attached-${notice.attachedNotice ? notice.attachedNotice.id : ''}' src="data:image/png;base64," class="img-fluid mx-auto d-block" alt="">
            <div class="container">
                <br>
                <h5 class="card-title">${notice.title}</h5>
                <p class="text-truncate">${notice.initialDescription}</p>
                <div class="row">
                    <div class="col-6"><span class="text-muted">09/08/2021</span></div>
                    <div class="col-6"><button data-id='${notice.id}'  class="btn btn-sm btn-info btn-seguir">Seguir leyendo...</button></div>
                </div>
                <br>
            </div>
        </div>
        <div class="col-12 bg-success text-center text-white">
            -
        </div>
    </div>`)

            });

            notices.forEach(notice => {
                if (notice.attachedNotice) {
                    fetch(service + 'attached-notice/' + notice.attachedNotice.id)
                        .then(res => res.json())
                        .then(attached => {
                            $('#notices #attached-' + notice.attachedNotice.id).attr('src', 'data:image/png;base64,' + attached.result.file);
                        })
                }

            });


        });
}

$('#btnMas').on('click', () => {
    getNotices();
});

$('#notices').on('click', '.btn-seguir', function () {

    fetch(service + 'notice/' + $(this).data('id'))
        .then(res => res.json())
        .then(resp => {
            notice = resp.result;
            console.log(notice);

            title.html(notice.title);
            initialDescription.html(notice.initialDescription);
            hashTag.html(notice.hashTag);
            description.html(notice.description);
            datPublic.html(notice.datPublic);

            if (notice.attachedNotice) {
                fetch(service + 'attached-notice/' + notice.attachedNotice.id)
                    .then(res => res.json())
                    .then(attached => {
                        banner.attr('src', 'data:image/png;base64,' + attached.result.file);
                    });

            }
            showHide('notice');
        });

});

$('#btnAtras').on('click',function(){
    showHide('notices');
});

let showHide = (element) => {
    if (element === 'notice') {
        $('#content').slideUp('slow', function () {
            $('#notice').slideDown(1000);
        });
    }else{
        $('#notice').slideUp('slow', function () {
            $('#content').slideDown(1000);
        });
    }
}
getNotices();