let tblScoreHistory = null;

$(function () {
    loadNavAndFooter('assets/content/static');  //relative path to content directory
    loadLeaderBoard();
});

function loadLeaderBoard() {
    const url = window.location.origin + `/api/github-leaderboad/v1/scores`;
    const table = $('#example').DataTable({
        "processing": true,
        "serverSide": true,
        "bFilter": false,
        "ordering": false,
        "oLanguage": {
            "oPaginate": {
                "sPrevious": '<i class="ni ni-bold-left"></i>',
                "sNext": '<i class="ni ni-bold-right"></i>'
            }
        },
        ajax: {
            "url": url,
            data: function (params) {
                return {
                    "limit": params.length,
                    "offset": params.start
                };
            },
            "type": "GET",
            dataFilter: function (data) {
                data = JSON.parse(data);
                data.recordsTotal = data.count;
                data.recordsFiltered = data.count;
                return JSON.stringify(data);
            }
        },
        "columns": [
            {
                "mData": "username",
                "mRender": function (data, type, row) {
                    return '<span>' +
                        '<img src="'+row.image+'&s=100" alt="Circle image" class="img-fluid rounded-circle profile-image" >' +
                            // row.name +
                        '</span>';
                }
            },
            {"data": "username"},
            {"data": "rank"},
            {"data": "points"}
        ]
    });

    $('#example tbody').on('click', 'tr', function () {
        let data = table.row( this ).data();
        $("#modal-score-history").modal('show');
        $('#modal-score-history-title').text(data.name);
        loadScoreHistory(data.id);
    } );
}

function loadScoreHistory(entityId) {
    const url = window.location.origin + `/api/github-leaderboad/v1/users/${entityId}/scores`;
    if(tblScoreHistory != null){
        tblScoreHistory.destroy();
    }
    tblScoreHistory = $('#tbl-score-history').DataTable({
        "processing": true,
        "serverSide": true,
        "bFilter": false,
        "ordering": false,
        "responsive": true,
        "oLanguage": {
            "oPaginate": {
                "sPrevious": '<i class="ni ni-bold-left"></i>',
                "sNext": '<i class="ni ni-bold-right"></i>'
            }
        },
        ajax: {
            "url": url,
            data: function (params) {
                return {
                    "limit": params.length,
                    "offset": params.start
                };
            },
            "type": "GET",
            dataFilter: function (data) {
                data = JSON.parse(data);
                data.recordsTotal = data.count;
                data.recordsFiltered = data.count;
                return JSON.stringify(data);
            }
        },
        "columns": [
            {
                "mData": "createdAt",
                "mRender": function (data, type, row) {
                    return moment.unix(data).format("YYYY-MM-DD HH:mm");
                }
            },
            {
                "mData": "prUrl",
                "mRender": function (data, type, row) {
                    return '<a target="_blank" href="'+data+'">'+data+'</a>';
                }
            }
        ]
    });
    
}
