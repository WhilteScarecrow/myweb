$(function () {
    loadTable(0);
    $("#sc_table").on("dbl-click-row.bs.table", function(ev, row) {
        $("#editing_id").val(row.id);
        $("#input_score_edit").val(row.score);
        $("#editScoreModal").modal("show");
    });
    //初始化表单验证
    $("#form_sc").validate({
        submitHandler: function (form) {
            let data_input = $("#form_sc").serialize();
            $.ajax({
                url:"api/sc",
                method:"post",
                data:data_input
            }).done(function (re) {
                if (re.code !== 1) {
                    alert("保存出错，错误玛:" + re.code + " 错误信息:" + re.message);
                }
                else {
                    search();
                    $("#myModal").modal("hide");
                }
            });
        }
    });

    $("#sc_sub").click(function () {
        $("#form_sc").submit();
    });
})

function editScore() {
    let id_editing = $("#editing_id").val();
    let score_editing = $("#input_score_edit").val();
    console.log(id_editing + " " + score_editing)
    $.ajax({
        url:"api/sc",
        method: "put",
        data: {
            id: id_editing,
            score: score_editing
        }
    }).done(function(re) {
        if (re.code !== 1) {
            alert("更新出错，错误玛:" + re.code + " 错误信息:" + re.message);
        }
        else {
            search();
            $("#editScoreModal").modal("hide");
        }

    })
}

function search() {
    $("#sc_table").bootstrapTable("destroy");
    loadTable(0);
}

function validateOn(boolean) {
    if (boolean) {
        let element_input_name = $("#input_name");
        element_input_name.attr("required");
        element_input_name.attr("minlength", "2");
        $("#input_age").attr("required");
        $("#input_no").attr("required");
    }
    else {
        $("#input_name").removeAttr("required").removeAttr("minlength");
        $("#input_age").removeAttr("required");
        $("#input_no").removeAttr("required");
    }
}

function deleteSc() {
    let id_deleting = $("#editing_id").val();
    if (confirm("确认删除该记录吗？")) {
        $.ajax({
            url: "api/sc",
            method: "delete",
            data: {
                id: id_deleting
            }
        }).done(function () {
            search()
            $("#editScoreModal").modal("hide");
        });
    }
}

function clear() {
    $("#input_id").val(null);
    $("#input_name").val(null);
    $("#input_age").val(null);
    $("#input_no").val(null);
    $("#input_gender").val(null);
    $("#input_admin").val(null);
    $("#input_password").val(null);
}

function loadTable() {
    $("#sc_table").bootstrapTable({
        method: "get",
        url: "api/sc/page",
        striped: true,
        dataType: "json",
        pagination: true,
        pageList: [5, 10, 15, 20],
        singleSelect: false,
        pageSize: 10,
        pageNumber: 1, //首页
        sidePagination: "server",
        // search: true,
        // customSearch:function(data, text) {
        //     return data.filter(function(row) {return (row.stdname + "").indexOf(text) > -1});
        // },
        responseHandler: function (res) {
            if (res.code === -100) {
                // console.log("未登录");
                window.location.replace("http://localhost:81/index1.html");
            }
            else if (res.code !== 1) {
                alert("请求失败，错误码：" + res.code);
                return null;
            }
            else {
                return res.data;
            }
        },
        queryParams: function (params) {
            let paraObj;
            let couname_in = $("#couname-search").val();
            let no_in = $("#no-search").val();

                paraObj = {
                    pageSize: params.limit,
                    pageIndex: params.offset,
                    sort: "id",
                    direct: "asc",
                    no: no_in
                };
            
                if(couname_in.length !== 0) {
                    paraObj.couname = couname_in;
                }

            return paraObj;
        },
        columns: [{
            field: "id",
            title: "序号"
        }, {
            field: "no",
            title: "学号"
        }, {
            field: "stdname",
            title: "学生姓名"
        }, {
            field: "couname",
            title: "课程"
        }, {
            field: "score",
            title: "成绩"
        }]
    })
}