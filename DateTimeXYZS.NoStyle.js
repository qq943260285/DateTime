var DateTimeXYZS;
(function () {
    DateTimeXYZS = function (divElement) {
        if (typeof divElement == 'string' && divElement.length > 0) divElement = document.getElementById(divElement);
        else if (divElement && typeof divElement == 'object' && divElement.tagName) div = divElement;
        else return;
        if (!divElement) alert('日期控件创建失败！');
        var thisObj = this,
            div = divElement,
            divTop,
            divLeft,
            minWidth = 150,//最小宽度
            minHeight,//最小高度
            divWidth = div.scrollWidth >= minWidth ? div.scrollWidth : minWidth,
            //divHeight = div.scrollHeight,
            divParent = div.parentNode,//获取父元素
            divContent = document.createElement('DIV'),//默认内容DIV
            divYearChoice = document.createElement('DIV'),//年份选择DIV
            divMonthChoice = document.createElement('DIV'),//月份选择DIV
            divDateChoice = document.createElement('DIV'),//日期选择DIV
            divYear,//年，DIV
            btnYearLeft,//年，左切换
            textYear,//年，文本框
            btnYearRight,//年，右切换

            divMonth,//月，DIV
            btnMonthLeft,//月，左切换
            textMonth,//月，文本框
            btnMonthRight,//月，右切换

            divDate,//日，DIV
            btnDateLeft,//日，左切换
            textDate,//日，文本框
            btnDateRight,//日，右切换

            divInformation,//当前时间信息DIV

            btnToday,//今天按钮
            btnOk,//确定按钮
            rowHeight = 30,
            documentOnclick,//全局点击事件

            setDateTime = function (date) {
                if (!date) date = new Date();
                thisObj.dateTime = date;
                thisObj.dateTimeYear = date.getFullYear();//年
                thisObj.dateTimeMonth = date.getMonth() + 1;//月
                thisObj.dateTimeDate = date.getDate();//日
                thisObj.dateTimeWeek = thisObj.getWeekNumber(thisObj.dateTimeYear, thisObj.dateTimeMonth, thisObj.dateTimeDate);//周
                thisObj.dateTimeDay = date.getDay();//星期(0：星期天)
                textYear.value = thisObj.dateTimeYear + '年';
                textMonth.value = thisObj.dateTimeMonth + '月';
                textDate.value = thisObj.dateTimeDate + '日';
                divInformation.innerHTML = thisObj.formatDate(thisObj.dateTime, 'www') + '，第' + thisObj.dateTimeWeek + '周';
            },//设置时间
            divType = {
                DateTime: 'DateTime',
                Content: 'Content',
                YearChoice: 'YearChoice',
                MonthChoice: 'MonthChoice',
                DateChoice: 'DateChoice'
            },
            createDiv = function (type) {
                minHeight = thisObj.divDateTime.offsetHeight;
                if (!type) type = divType.Content;
                //容器共用设置参数
                var setDivSryle = function (div) {
                        div.className += ' dateTimeDivAssembly';
                        div.style.width = divWidth - 22 + 'px';
                        div.style.padding = '5px';
                        div.style.minWidth = '128px';
                    },
                    setBtnSwitchSryle = function (span) {
                        span.style.cursor = 'pointer';
                        //span.style.fontFamily = '楷体';
                        //span.style.fontSize = '14px';
                        span.className += ' dateTimeBtn';
                    },
                    setDivInputSryle = function (input) {
                        input.className += ' dateTimeText';
                        input.readOnly = true;
                    },
                    deletNodes = function (Nodes) {
                        for (var deleteIndex = 0; deleteIndex < Nodes.childNodes.length; deleteIndex++) {
                            Nodes.removeChild(Nodes.childNodes[deleteIndex]);
                        }
                    },
                    TableType = {Year: 'Year', Month: 'Month', Date: 'Date'},
                    createTable = function (type, data) {
                        var table = document.createElement('TABLE');
                        table.className = 'dateTimeTable';
                        table.style.minWidth = '150px';
                        table.style.height = '150px';
                        table.style.margin = 'auto';
                        if (type == TableType.Year) {
                            table.className += ' dateTimeTableYear';
                            for (var i = 0; i < 3; i++) {
                                var tr = document.createElement('tr');
                                for (var j = 0; j < 4; j++) {
                                    var td = document.createElement('td');
                                    td.width = divWidth / 4 + 'px';

                                    td.onmousemove = function (e) {
                                        this.className = 'tbOnmousemove';
                                    };
                                    td.onmouseout = function (e) {
                                        this.className = '';
                                    };

                                    data = data ? data : thisObj.dateTimeYear;
                                    if (i == 0 && j == 0) {
                                        td.innerHTML = '◀';
                                        td.onclick = function () {
                                            deletNodes(divYearChoice);
                                            divYearChoice.appendChild(createTable(TableType.Year, data - 8));
                                            thisObj.divDateTime.appendChild(divYearChoice);
                                        }
                                    }
                                    else if (i == 2 && j == 3) {
                                        td.innerHTML = '▶';
                                        td.onclick = function () {
                                            deletNodes(divYearChoice);
                                            divYearChoice.appendChild(createTable(TableType.Year, data + 8));
                                            thisObj.divDateTime.appendChild(divYearChoice);
                                        }
                                    }
                                    else {
                                        td.innerHTML = data - (5 - i * 4 - j);
                                        td.setAttribute('Year', data - (5 - i * 4 - j));
                                        if (data - (5 - i * 4 - j) == thisObj.dateTimeYear) {
                                            td.className = 'tdSelected';
                                            td.onmousemove = null;
                                            td.onmouseout = null;
                                        }
                                        td.onclick = function () {
                                            thisObj.dateTime.setFullYear(this.getAttribute('Year'));
                                            setDateTime(thisObj.dateTime);
                                            setShoDiv(divType.Content);
                                        };
                                    }
                                    ;
                                    tr.appendChild(td);
                                }
                                ;
                                table.appendChild(tr);
                            }
                        }
                        else if (type == TableType.Month) {
                            table.className += ' dateTimeTableMonth';
                            for (var i = 0; i < 4; i++) {
                                var tr = document.createElement('tr');
                                for (var j = 0; j < 3; j++) {
                                    var td = document.createElement('td');
                                    td.width = divWidth / 3 + 'px';
                                    td.onmousemove = function (e) {
                                        this.className = 'tbOnmousemove';
                                    };
                                    td.onmouseout = function (e) {
                                        this.className = '';
                                    };
                                    td.innerHTML = thisObj.MonthList[i * 3 + j];
                                    td.setAttribute('Month', i * 3 + j);
                                    if (i * 3 + j + 1 == thisObj.dateTimeMonth) {
                                        td.className = 'tdSelected';
                                        td.onmousemove = null;
                                        td.onmouseout = null;
                                    }
                                    td.onclick = function () {
                                        thisObj.dateTime.setMonth(this.getAttribute('Month'));
                                        setDateTime(thisObj.dateTime);
                                        setShoDiv(divType.Content);
                                    };
                                    tr.appendChild(td);
                                }
                                ;
                                table.appendChild(tr);
                            }
                            ;
                        }
                        else if (type == TableType.Date) {
                            table.className += ' dateTimeTableDate';
                            var daten = thisObj.getMonthDays(thisObj.dateTimeYear, thisObj.dateTimeMonth - 1),
                                x = new Date(thisObj.dateTimeYear, thisObj.dateTimeMonth - 1, 1).getDay();


                            var thead = document.createElement('thead');
                            var tr = document.createElement('tr');
                            for (var w = 0; w < 7; w++) {
                                var th = document.createElement('th');
                                th.width = divWidth / 7 + 'px';
                                th.innerHTML = thisObj.WeekList[w];
                                tr.appendChild(th);
                            }
                            thead.appendChild(tr);
                            table.appendChild(thead);


                            var tbody = document.createElement('tbody');
                            var tbN = parseInt((daten + x) % 7 > 0 ? (daten + x) / 7 + 1 : (daten + x) / 7);
                            for (var i = 0; i < tbN; i++) {
                                var tr = document.createElement('tr');
                                for (var j = 0; j < 7; j++) {
                                    var td = document.createElement('td');
                                    //td.width = divWidth / 7 + 'px';
                                    td.onmousemove = function (e) {
                                        this.className = 'tbOnmousemove';
                                    };
                                    td.onmouseout = function (e) {
                                        this.className = '';
                                    };
                                    if (i * 7 + j - x > -1 && i * 7 + j - x < daten) {
                                        td.innerHTML = i * 7 + j - x + 1;
                                        td.setAttribute('Data', i * 7 + j - x + 1);

                                        if (i * 7 + j - x + 1 == thisObj.dateTimeDate) {
                                            td.className = 'tdSelected';
                                            td.onmousemove = null;
                                            td.onmouseout = null;
                                        }

                                        td.onclick = function () {
                                            thisObj.dateTime.setDate(this.getAttribute('Data'));
                                            setDateTime(thisObj.dateTime);
                                            setShoDiv(divType.Content);
                                        };
                                    }
                                    else {
                                        td.innerHTML = ' ';
                                        td.onmousemove = null;
                                        td.onmouseout = null;
                                    }

                                    tr.appendChild(td);
                                }
                                tbody.appendChild(tr);
                            }
                            table.appendChild(tbody);
                        }
                        return table;
                    };

                if (type == divType.DateTime) {
                    deletNodes(thisObj.divDateTime);
                    thisObj.divDateTime.className = 'dateTimeDivContainerPublic dateTimeDivDateTime';
                    thisObj.divDateTime.style.width = divWidth + 'px';
                    thisObj.divDateTime.style.minWidth = minWidth + 'px';
                    thisObj.divDateTime.style.display = 'none';
                    thisObj.divDateTime.style.zIndex = 88888888;
                    thisObj.divDateTime.onclick = function (e) {
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;//阻止事件
                    };
                    thisObj.divDateTime.appendChild(divContent);
                }
                else if (type == divType.Content) {
                    deletNodes(divContent);
                    divContent.className = 'dateTimeDivContainerPublic dateTimeDivContent';
                    //========== 年份容器 ==========
                    divYear = document.createElement('DIV');
                    divYear.className = 'dateTimeDivYear';
                    setDivSryle(divYear);

                    btnYearLeft = document.createElement('INPUT');
                    btnYearLeft.className = 'dateTimeBtnYearLeft btnLeftSwitch';
                    btnYearLeft.setAttribute('type', 'button');
                    btnYearLeft.value = '◀';
                    setBtnSwitchSryle(btnYearLeft);
                    btnYearLeft.onclick = function () {
                        thisObj.dateTime.setFullYear(thisObj.dateTimeYear - 1);
                        setDateTime(thisObj.dateTime);
                    };
                    divYear.appendChild(btnYearLeft);

                    textYear = document.createElement('INPUT');
                    textYear.className = 'dateTimeTextYear';
                    setDivInputSryle(textYear);
                    textYear.onclick = function () {
                        createDiv(divType.YearChoice);
                        setShoDiv(divType.YearChoice);
                    };
                    divYear.appendChild(textYear);

                    btnYearRight = document.createElement('INPUT');
                    btnYearRight.className = 'dateTimeBtnYearRight btnRightSwitch';
                    btnYearRight.setAttribute('type', 'button');
                    btnYearRight.value = '▶';
                    setBtnSwitchSryle(btnYearRight);
                    btnYearRight.onclick = function () {
                        thisObj.dateTime.setFullYear(thisObj.dateTimeYear + 1);
                        setDateTime(thisObj.dateTime);
                    };
                    divYear.appendChild(btnYearRight);

                    var divYearLebel = document.createElement('LEBEL');
                    divYearLebel.className = 'dateTimeLebel';
                    divYearLebel.innerHTML = '年';
                    divYearLebel.style.marginLeft = '7px';
                    divYear.appendChild(divYearLebel);
                    divContent.appendChild(divYear);
                    //==============================
                    //========= 月份容器 ===========
                    divMonth = document.createElement('DIV');
                    divMonth.className = 'dateTimeDivMonth';
                    setDivSryle(divMonth);


                    btnMonthLeft = document.createElement('INPUT');
                    btnMonthLeft.className = 'dateTimeBtnMonthLeft btnLeftSwitch';
                    btnMonthLeft.setAttribute('type', 'button');
                    btnMonthLeft.value = '◀';
                    setBtnSwitchSryle(btnMonthLeft);
                    btnMonthLeft.onclick = function () {
                        thisObj.dateTime.setMonth(thisObj.dateTimeMonth - 2);
                        setDateTime(thisObj.dateTime);
                    };
                    divMonth.appendChild(btnMonthLeft);

                    textMonth = document.createElement('INPUT');
                    textMonth.className = 'dateTimeTextMonth';
                    setDivInputSryle(textMonth);
                    textMonth.onclick = function () {
                        createDiv(divType.MonthChoice);
                        setShoDiv(divType.MonthChoice);
                    };
                    textMonth.onmousemove = function () {
                        thisObj.divDateTime.style.display = '';
                    };
                    divMonth.appendChild(textMonth);
                    btnMonthRight = document.createElement('INPUT');
                    btnMonthRight.className = 'dateTimeBtnMonthRight btnRightSwitch';
                    btnMonthRight.setAttribute('type', 'button');
                    btnMonthRight.value = '▶';
                    setBtnSwitchSryle(btnMonthRight);
                    btnMonthRight.onclick = function () {
                        thisObj.dateTime.setMonth(thisObj.dateTimeMonth);
                        setDateTime(thisObj.dateTime);
                    };
                    divMonth.appendChild(btnMonthRight);

                    var divMonthLebel = document.createElement('LEBEL');
                    divMonthLebel.className = 'dateTimeLebel';
                    divMonthLebel.innerHTML = '月';
                    divMonthLebel.style.marginLeft = '7px';
                    divMonth.appendChild(divMonthLebel);

                    divContent.appendChild(divMonth);
                    //==============================

                    //========= 日期容器 ===========
                    divDate = document.createElement('DIV');
                    divDate.className = 'dateTimeDivDate';
                    setDivSryle(divDate);

                    btnDateLeft = document.createElement('INPUT');
                    btnDateLeft.className = 'dateTimeBtnDateLeft btnLeftSwitch';
                    btnDateLeft.setAttribute('type', 'button');
                    btnDateLeft.value = '◀';
                    setBtnSwitchSryle(btnDateLeft);
                    btnDateLeft.onclick = function () {
                        thisObj.dateTime.setDate(thisObj.dateTimeDate - 1);
                        setDateTime(thisObj.dateTime);
                    };
                    divDate.appendChild(btnDateLeft);

                    textDate = document.createElement('INPUT');
                    textDate.className = 'dateTimeTextDate';
                    setDivInputSryle(textDate);
                    textDate.onclick = function () {
                        createDiv(divType.DateChoice);
                        setShoDiv(divType.DateChoice);
                    };
                    divDate.appendChild(textDate);

                    btnDateRight = document.createElement('INPUT');
                    btnDateRight.className = 'dateTimeBtnDateRight btnRightSwitch';
                    btnDateRight.setAttribute('type', 'button');
                    btnDateRight.value = '▶';
                    setBtnSwitchSryle(btnDateRight);
                    btnDateRight.onclick = function () {
                        thisObj.dateTime.setDate(thisObj.dateTimeDate + 1);
                        setDateTime(thisObj.dateTime);
                    };
                    divDate.appendChild(btnDateRight);

                    var divDateLebel = document.createElement('LEBEL');
                    divDateLebel.className = 'dateTimeLebel';
                    divDateLebel.innerHTML = '日';
                    divDateLebel.style.marginLeft = '7px';
                    divDate.appendChild(divDateLebel);

                    divContent.appendChild(divDate);

                    //当前时间信息容器
                    divInformation = document.createElement('DIV');
                    divInformation.className = 'dateTimeDivInformation';
                    setDivSryle(divInformation);
                    divContent.appendChild(divInformation);

                    //按钮容器
                    var divBtn = document.createElement('DIV');
                    divBtn.className = 'dateTimeDivBtn';
                    setDivSryle(divBtn);

                    btnToday = document.createElement('INPUT');
                    btnToday.className = 'dateTimeBtnToday';
                    btnToday.setAttribute('type', 'button');
                    btnToday.value = '今天';
                    setBtnSwitchSryle(btnToday);
                    btnToday.style.float = 'left';
                    btnToday.onclick = function () {
                        setDateTime();
                    };
                    divBtn.appendChild(btnToday);


                    btnOk = document.createElement('INPUT');
                    btnOk.className = 'dateTimeBtnOk';
                    btnOk.setAttribute('type', 'button');
                    btnOk.value = '确定';
                    setBtnSwitchSryle(btnOk);
                    btnOk.style.float = 'right';
                    btnOk.onclick = function () {
                        div.innerHTML = thisObj.formatDate(thisObj.dateTime, thisObj._dateFormat);
                        div.setAttribute('dateTimeYear', thisObj.dateTime.getFullYear());
                        div.setAttribute('dateTimeMonth', thisObj.dateTime.getMonth());
                        div.setAttribute('dateTimeDate', thisObj.dateTime.getDate());
                        thisObj.divDateTime.style.display = 'none';
                        thisObj.Callback(thisObj.dateTime);
                    };
                    divBtn.appendChild(btnOk);

                    divContent.appendChild(divBtn);
                }
                else if (type == divType.YearChoice) {
                    deletNodes(divYearChoice);
                    divYearChoice.className = 'dateTimeDivContainerPublic dateTimeDivYearChoice';
                    divYearChoice.appendChild(createTable(TableType.Year));
                    thisObj.divDateTime.appendChild(divYearChoice);
                }
                else if (type == divType.MonthChoice) {
                    deletNodes(divMonthChoice);
                    divMonthChoice.className = 'dateTimeDivContainerPublic dateTimeDivMonthChoice';
                    divMonthChoice.appendChild(createTable(TableType.Month));
                    thisObj.divDateTime.appendChild(divMonthChoice);
                }
                else if (type == divType.DateChoice) {
                    deletNodes(divDateChoice);
                    divDateChoice.className = 'dateTimeDivContainerPublic dateTimeDivDateChoice';
                    divDateChoice.appendChild(createTable(TableType.Date));
                    thisObj.divDateTime.appendChild(divDateChoice);
                }

            },
            setShoDiv = function (type) {
                if (!type) type = divType.Content;
                divContent.style.display = (type == divType.Content ? 'inline' : 'none');
                divYearChoice.style.display = (type == divType.YearChoice ? 'inline' : 'none');
                divMonthChoice.style.display = (type == divType.MonthChoice ? 'inline' : 'none');
                divDateChoice.style.display = (type == divType.DateChoice ? 'inline' : 'none');

            },
            setShowMonthDate = function () {
                divMonth.style.display = (thisObj._isMonth ? '' : 'none');
                divDate.style.display = (thisObj._isDate ? '' : 'none');
                divInformation.style.display = (thisObj._isDate ? '' : 'none');
                btnToday.value = thisObj._isMonth ? (thisObj._isDate ? '今天' : '本月') : '今年';
                thisObj.divDateTime.style.Height = thisObj._isMonth ? (thisObj._isDate ? rowHeight * 5 : rowHeight * 3) : rowHeight * 2;
            },


            isObj = function (obj, str) {
                var Timer, h;
                var SlideDown = function () {
                    var current = parseInt(obj.style.height);
                    if (current >= h) {
                        clearInterval(Timer);
                        //obj.style.height = h + 'px';
                        obj.style.height = '';
                    }
                    else {
                        current += 5;
                        obj.style.height = current + 'px';
                    }
                };
                var SlideUp = function () {
                    var current = parseInt(obj.style.height);
                    if (current <= 0) {
                        clearInterval(Timer);
                        obj.style.display = 'none';
                    }
                    else {
                        current--;
                        obj.style.height = current + 'px';
                    }
                };
                if (str) {
                    Timer = setInterval(SlideUp, 1);
                }
                else {
                    obj.style.height = '';
                    h = obj.offsetHeight;
                    obj.style.height = '1px';
                    Timer = setInterval(SlideDown, 1);
                }
            }

        ;


        this._isMonth = true;//是否有月
        this._isDate = true;//是否有日
        this.Callback;
        this._dateFormat = 'yyyy-MM-dd';//日期格式
        this.divDateTime = document.createElement('DIV');//弹出DIV
        this.dateTime;//设置的时间
        this.dateTimeYear;//年
        this.dateTimeMonth;//月
        this.dateTimeDate;//日
        this.dateTimeWeek;//周
        this.dateTimeDay;//星期
        this.WeekList = ['日', '一', '二', '三', '四', '五', '六'];
        this.MonthList = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        /**
         * 将日期格式化成指定格式的字符串
         * @param date 要格式化的日期，不传时默认当前时间，也可以是一个时间戳
         * @param fmt 目标字符串格式，支持的字符有：y（年） M（月）d（日）q（季度）w（星期）H（24小时制的小时） h（12小时制的小时） m（分钟） s（秒） S（毫秒）另外，字符的个数决定输出字符的长度，如，yy输出16，yyyy输出2016，ww输出周五，www输出星期五，默认：yyyy-MM-dd HH:mm:ss
         * @returns 返回格式化后的日期字符串
         */
        this.formatDate = function (date, fmt) {
            date = date == undefined ? new Date() : date;
            date = typeof date == 'number' ? new Date(date) : date;
            fmt = fmt || 'yyyy-MM-dd HH:mm:ss';
            var obj =
                {
                    'y': date.getFullYear(), // 年份，注意必须用getFullYear
                    'M': date.getMonth() + 1, // 月份，注意是从0-11
                    'd': date.getDate(), // 日期
                    'q': Math.floor((date.getMonth() + 3) / 3), // 季度
                    'w': date.getDay(), // 星期，注意是0-6
                    'H': date.getHours(), // 24小时制
                    'h': date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, // 12小时制
                    'm': date.getMinutes(), // 分钟
                    's': date.getSeconds(), // 秒
                    'S': date.getMilliseconds() // 毫秒
                };

            for (var i in obj) {
                fmt = fmt.replace(new RegExp(i + '+', 'g'), function (m) {
                    var val = obj[i] + '';
                    if (i == 'w') return (m.length > 2 ? '星期' : '周') + thisObj.WeekList[val];
                    for (var j = 0, len = val.length; j < m.length - len; j++) val = '0' + val;
                    return m.length == 1 ? val : val.substring(val.length - m.length);
                });
            }
            ;
            return fmt;
        };
        /**
         * 判断年份是否为润年
         *
         * @param {Number} y
         */
        this.isLeapYear = function (y) {
            return (y % 400 == 0) || (y % 4 == 0 && y % 100 != 0);
        };
        /**
         * 获取某一年份的某一月份的天数
         *
         * @param {Number} 年
         * @param {Number} 月
         */
        this.getMonthDays = function (y, m) {
            return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m] || (this.isLeapYear(y) ? 29 : 28);
        };
        /**
         * 获取某年的某天是第几周(星期日开始)
         * @param {Number} 年
         * @param {Number} 月
         * @param {Number} 日
         * @returns {Number}
         */
        this.getWeekNumber = function (y, m, d) {
            var totalDays = new Date(y, 0, 1).getDay() + d;
            for (var i = 0; i < m - 1; i++) {
                totalDays += this.getMonthDays(y, i);
            }
            ;
            //得到第几周
            return parseInt(totalDays / 7) + (totalDays % 7 > 0 ? 1 : 0);
        };
        //初始化
        this.DateTimeLoad = function (date, Callback) {
            date = date || new Date();
            setDateTime(date);
            setShoDiv();
            setShowMonthDate();
            div.innerHTML = thisObj.formatDate(thisObj.dateTime, thisObj._dateFormat);
            div.setAttribute('dateTimeYear', thisObj.dateTime.getFullYear());
            div.setAttribute('dateTimeMonth', thisObj.dateTime.getMonth());
            div.setAttribute('dateTimeDate', thisObj.dateTime.getDate());
            thisObj.Callback = Callback || function (d) {
            };
        };

        div.style.cursor = 'pointer';
        div.onclick = function (e) {
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            thisObj.divDateTime.style.display = 'inline';
            setShoDiv(divType.Content);

            var y = this.getAttribute('dateTimeYear');
            var m = this.getAttribute('dateTimeMonth');
            var d = this.getAttribute('dateTimeDate');
            if (y)
                setDateTime(new Date(parseInt(y), parseInt(m), parseInt(d)));
            divTop = div.offsetTop;
            divLeft = div.offsetLeft;
            thisObj.divDateTime.style.top = divTop + 'px';
            thisObj.divDateTime.style.left = divLeft + 'px';

            isObj(thisObj.divDateTime, '');
            //操作全局点击
            documentOnclick = document.onclick;
            document.onclick = function () {
                thisObj.divDateTime.style.display = 'none';
                document.onclick = documentOnclick;
            };
        };
        divParent.appendChild(thisObj.divDateTime);
        createDiv(divType.DateTime);
        createDiv(divType.Content);
        this.DateTimeLoad();

    };
    DateTimeXYZS.prototype = {
        constructor: DateTimeXYZS,
        setDateFormat: function (s) {
            if (/(^y{1,4}-M{1,2}-d{1,2}$)|(^y{1,4}-M{1,2}$)|(^y{1,4}$)/.test(s)) {
                this._isMonth = (s.indexOf('M') > 0);
                this._isDate = (s.indexOf('d') > 0);
                this._dateFormat = s;
                this.DateTimeLoad(this.dateTime, this.Callback);
                return true;
            }
            return false;
        }
    };
})();
