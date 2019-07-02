$(function () {
    let html = $('html');

    if (bowser.mobile) {
        html.addClass('mobile');
    } else if (bowser.tablet) {
        html.addClass('tablet');
    } else {
        html.addClass('desktop');
    }

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
        tbody = table.find('tbody'),
        rows = 25,
        data = [
            {
                name: 'positive tooltip',
                html: `<span class="percentage">100%</span>
                    <svg focusable="false"><use xlink:href="#svg-arrow-up-right"></use></svg>
                    <ul class="tooltip-content">
                        <li>3 lektioner om ugen</li>
                        <li>3 ud af 3 benytter korrekt</li>
                    </ul>`
            },
            {
                name: 'negative tooltip',
                html: `<span class="percentage">25%</span>
                    <svg focusable="false"><use xlink:href="#svg-arrow-up-right"></use></svg>
                    <ul class="tooltip-content">
                        <li>1.5 lektioner om ugen</li>
                        <li>1 ud af 4 benytter korrekt</li>
                    </ul>`
            },
            {
                name: 'neutral',
                html: `<span class="percentage">88.7%</span>
                    <svg focusable="false"><use xlink:href="#svg-minus"></use></svg>`
            },
            {
                name: 'missing',
                html: `<span class="percentage">0%</span>
                    <svg focusable="false"><use xlink:href="#svg-close"></use></svg>`
            }
        ];

    for (let i = 0; i < rows; i++) {
        let row = [];
        row.push('<tr>');
        row.push(`<th>${Math.random().toString(36).substring(7)}</th>`)
        for (let j = 0; j < table.find('thead tr th').length - 2; j++) {
            let element = data[Math.floor(Math.random() * ((data.length - 1) - 0 + 1)) + 0];
            row.push(`<td class="${element.name}">${element.html}</td>`);
        }
        row.push('<td><span class="spacer"></span></td>');
        row.push('</tr>');
        row = row.join('');
        tbody.append(row);
    }


    let exportOptions = {
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
                    trigger: 'click',
                    functionInit: function (instance, helper) {
                        var content = $(helper.origin).find('.tooltip-content').detach();
                        instance.content(content);
                    }
                });
            }
        });
    if (html.hasClass('desktop')) {
        table.on('mouseenter', 'tbody td', function () {
            let colIdx = datatable.cell(this).index().column;

            $(datatable.cells().nodes()).removeClass('highlight');
            $(datatable.column(colIdx).nodes()).addClass('highlight');
        }).on('mouseleave', 'tbody td', function () {
            $(datatable.cells().nodes()).removeClass('highlight');
        });
    }
});