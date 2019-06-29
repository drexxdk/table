$(function () {

    let table_header = (instance, wrapper) => {
        let ths = wrapper.find('thead th');
        for (let i = 0; i < ths.length; i++) {
            let column = $(ths[i]),
                text = column.html();

            if (text) {
                column.empty().append(`<span>${text}</span>`);
            }
        }
    };
    
    let table = $('#datatable'),
        exportOptions = {
            "format": {
                header: (text, index, th) => {
                    return $(th).find('span:first').html();
                }
            }
        },
        datatable = table.DataTable({
            //scrollY: 500,
            scrollX: true,
            scrollCollapse: true,
            paging: false,
            fixedColumns: true,
            fixedHeader: true,
            info: false,
            dom: 'lBfrtip',
            bSortCellsTop: true,
            buttons: [
                {
                    extend: 'copyHtml5',
                    footer: false,
                    exportOptions: exportOptions
                },
                {
                    extend: 'excelHtml5',
                    footer: false,
                    exportOptions: exportOptions
                },
                {
                    extend: 'csvHtml5',
                    footer: false,
                    exportOptions: exportOptions
                }
            ],
            initComplete: (settings) => {
                let instance = settings.oInstance.api(true),
                    wrapper = $(settings.nTableWrapper);

                table_header(instance, wrapper);

                table.find('.tooltip').tooltipster({
                    //trigger: 'custom',
                    //triggerOpen: {
                    //    click: true
                    //},
                    functionInit: function (instance, helper) {
                        var content = $(helper.origin).find('.tooltip-content').detach();
                        instance.content(content);
                    }
                });
            }
        });

    table.on('mouseenter', 'tbody td', function () {
        let colIdx = datatable.cell(this).index().column;

        $(datatable.cells().nodes()).removeClass('highlight');
        $(datatable.column(colIdx).nodes()).addClass('highlight');
    }).on('mouseleave', 'tbody td', function () {
        $(datatable.cells().nodes()).removeClass('highlight');
    });
});