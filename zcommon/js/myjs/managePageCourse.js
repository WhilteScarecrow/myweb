$(function () {
    loadTable(0);
    $("#form_course").validate({
        submitHandler: function (form) {
            let data_input = $("#form_course").serialize();
            $.ajax({
                url:"/api/course",
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

    $("#course_new").click(function () {
        $("#myModalLabel").html("新增课程");
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

    $("#course_sub").click(function () {
        if ($("#input_operation").val() === "1") {
            searchAdvanced();
        }
        else {
            $("#form_course").submit();
        }
    });
})

function loadTable(operation) {
    $("#course_table").bootstrapTable({
        method: "get",
        url: "/api/course/page",
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
                };
                if (input_name.length !== 0) {
                    paraObj.name = input_name;
                }
                if (input_no.length !== 0) {
                    paraObj.teacher = input_no;
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
            title: "课程名称"
        }, {
            field: "teacher",
            title: "教师工号"
        }]
    });
}

function search() {
    // console.log($("#search-name").val())
    $("#course_table").bootstrapTable("destroy");
    loadTable(0);
}

function searchAdvanced() {
    $("#course_table").bootstrapTable("destroy");
    loadTable(1);
    validateOn(true);
    $("#input_operation").val(0);
    $("#myModal").modal("hide");
}

function editCourse(id) {
    $("#myModalLabel").html("编辑课程信息");
    $("#myModal").modal("show");
    $.ajax({
        url: "/api/course/id/" + id
    }).done(function (rs) {
        $("#input_id").val(id);
        $("#input_name").val(rs.data.name);
        $("#input_no").val(rs.data.teacher);
    });
}

function delCourse(id) {
    if (confirm("确认删除该记录吗？")) {
        $.ajax({
            url: "/api/course/" + id,
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