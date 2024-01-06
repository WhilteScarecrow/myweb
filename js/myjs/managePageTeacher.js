$(function () {
    loadTable(0);
    $("#form_teacher").validate({
        submitHandler: function (form) {
            let data_input = $("#form_teacher").serialize();
            $.ajax({
                url:"api/teacher",
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

    $("#teacher_new").click(function () {
        $("#myModalLabel").html("新增教师");
        clear();
    });

    $("#multi-search").click(function () {
        //清空表单数据
        clear();
        //禁用验证
        validateOn(false);
        //切换模态框到多属性搜索模式
        $("#input_operation").val(1);
        $("#myModalLabel").html("多属性查询");
        $("#myModal").modal("show");
    });

    $("#teacher_sub").click(function () {
        if ($("#input_operation").val() === "1") {
            searchAdvanced();
        }
        else {
            $("#form_teacher").submit();
        }
    });
})

function loadTable(operation) {
    $("#stu_table").bootstrapTable({
        method: "get",
        url: "api/teacher/page",
        striped: true,
        dataType: "json",
        pagination: true,
        pageList: [5, 10, 15, 20],
        singleSelect: false,
        pageSize: 10,
        pageNumber: 1, //首页
        sidePagination: "server",
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
            if (operation === 1) {
                let input_name = $("#input_name").val();
                let input_no = $("#input_no").val();
                paraObj = {
                    pageSize: params.limit,
                    pageIndex: params.offset,
                    sort: "id",
                    direct: "asc",
                    age: $("#input_age").val(),
                    gender: $("#input_gender").val(),
                    admin: $("#input_admin").val()
                };
                if (input_name.length !== 0) {
                    paraObj.name = input_name;
                }
                if (input_no.length !== 0) {
                    paraObj.no = input_no;
                }

            }
            else {
                paraObj = {
                    pageSize: params.limit,
                    pageIndex: params.offset,
                    sort: "id",
                    direct: "asc",
                    name: $("#search-name").val(),
                }
            }

            return paraObj;
        },
        columns: [{
            field: "id",
            title: "序号"
        }, {
            field: "name",
            title: "姓名"
        }, {
            field: "gender",
            formatter: function (value) {
                if (value === 1) {
                    return "男";
                }
                else if (value === 2) {
                    return "女";
                }
            },
            title: "性别"
        }, {
            field: "age",
            title: "年龄"
        }, {
            field: "no",
            title: "工号"
        },{
            field: "admin",
            title: "管理权限"
        }, {
            field: "id",
            formatter: function (value) {
                let html = "<a href='#' onclick='editTeacher("+value+")'>编辑</a>";
                html += " <a id='delete_link' href='#' onclick='delTeacher("+value+")'>删除</a>"
                return html;
            },
            title: "操作"
        }]
    });
}

function search() {
    // console.log($("#search-name").val())
    $("#stu_table").bootstrapTable("destroy");
    loadTable(0);
}

function searchAdvanced() {
    $("#stu_table").bootstrapTable("destroy");
    loadTable(1);
    validateOn(true);
    $("#input_operation").val(0);
    $("#myModal").modal("hide");
}

function editTeacher(id) {
    $("#myModalLabel").html("编辑教师信息");
    $("#myModal").modal("show");
    $.ajax({
        url: "api/teacher/id/" + id
    }).done(function (rs) {
        $("#input_id").val(id);
        $("#input_name").val(rs.data.name);
        $("#input_age").val(rs.data.age);
        $("#input_no").val(rs.data.no);
        $("#input_gender").val(rs.data.gender);
        $("#input_admin").val(rs.data.admin);
        $("#input_password").val(rs.data.password);
    });
}

function delTeacher(id) {
    if (confirm("确认删除该记录吗？")) {
        $.ajax({
            url: "api/teacher/" + id,
            method: "delete"
        }).done(function () {
            search()
        });
    }
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

function clear() {
    $("#input_id").val(null);
    $("#input_name").val(null);
    $("#input_age").val(null);
    $("#input_no").val(null);
    $("#input_gender").val(null);
    $("#input_admin").val(null);
    $("#input_password").val(null);
}