var DateTimeXYZS;
(function () {
    DateTimeXYZS = function (ElementID) {
        var div;
        if (typeof ElementID == "string")div = document.getElementById(ElementID);
        else if (typeof ElementID == "object" && ElementID.tagName)div = ElementID;
        else return;
        if (!div)alert("日期控件创建失败！");
        div.style.cursor = "pointer";
        var thisObj = this,
            divTop,
            divLeft,
            minWidth = 150,//最小宽度
            minHeight,//最小高度
            divWidth = div.scrollWidth>=minWidth?div.scrollWidth:minWidth,
            divHeight = div.scrollHeight,
            divParent = div.parentNode,//获取父元素
            divContent = document.createElement("DIV"),//默认内容DIV
            divYearChoice = document.createElement("DIV"),//年份选择DIV
            divMonthChoice = document.createElement("DIV"),//月份选择DIV
            divDateChoice = document.createElement("DIV"),//日期选择DIV
            divYear,//年，DIV
            divYearLeft,//年，左切换
            divYearText,//年，文本框
            divYearRight,//年，右切换

            divMonth,//月，DIV
            divMonthLeft,//月，左切换
            divMonthText,//月，文本框
            divMonthRight,//月，右切换

            divDate,//日，DIV
            divDateLeft,//日，左切换
            divDateText,//日，文本框
            divDateRight,//日，右切换

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
                divYearText.value = thisObj.dateTimeYear;
                divMonthText.value = thisObj.dateTimeMonth;
                divDateText.value = thisObj.dateTimeDate;
                divInformation.innerHTML = thisObj.formatDate(thisObj.dateTime, "www") + "，第" + thisObj.dateTimeWeek + "周";
            },//设置时间
            divType = {
                DateTime: "DateTime",
                Content: "Content",
                YearChoice: "YearChoice",
                MonthChoice: "MonthChoice",
                DateChoice: "DateChoice"
            },
            createDiv = function (type) {
                minHeight = thisObj.divDateTime.offsetHeight;
                if (!type)type = divType.Content;
                //容器共用设置参数
                var setDivSryle = function (div) {
                        div.style.width = divWidth - 20 + "px";
                        div.style.minWidth = "130px";
                        div.style.margin = "5px";
                        div.style.border = "solid #000 1px";
                        div.style.textAlign = "center";
                        div.style.vertAlign = "middle";
                        div.style.overflow = "hidden";
                        div.style.padding = "5px"
                    },
                    setSpanSwitchSryle = function (span) {
                        span.style.height = rowHeight + "px";
                        span.style.cursor = "pointer";
                        span.style.fontFamily = "楷体";
                        span.style.fontSize = "14px";

                    },
                    setDivInputSryle = function (input) {
                        input.style.width = "50px";
                        input.style.height = "22px";
                        input.style.margin = "0px 7px 0px 7px";
                        input.style.textAlign = "center";
                        input.style.border = "solid #000 1px";
                        input.style.cursor = "pointer";
                        input.readOnly = true;
                    },
                    deletNodes = function (Nodes) {
                        for (var deleteIndex = 0; deleteIndex < Nodes.childNodes.length; deleteIndex++) {
                            Nodes.removeChild(Nodes.childNodes[deleteIndex]);
                        }
                        ;
                    },
                    TableType = {Year: "Year", Month: "Month", Date: "Date"},
                    createTable = function (type, data) {
                        var createTd = function (w, h) {
                            var divTd = document.createElement("DIV");
                            divTd.style.float = "left";
                            divTd.style.background = "#fff";
                            divTd.style.border = "solid #000 1px";
                            divTd.style.margin = "0 auto";
                            divTd.style.width = w + "px";
                            divTd.style.height = h + "px";
                            divTd.style.lineHeight = h + "px";
                            divTd.style.cursor = "pointer";
                            divTd.onmousemove = function (e) {
                                this.style.border = "1px solid #f00";
                            };
                            divTd.onmouseout = function (e) {
                                this.style.border = "solid #000 1px";
                            };

                            return divTd;
                        };
                        var divTable = document.createElement("DIV");
                        if (type == TableType.Year) {
                            for (var i = 0; i < 3; i++) {
                                var divTr = document.createElement("DIV");
                                for (var j = 0; j < 4; j++) {
                                    var divTd = createTd(divWidth / 4 - 2, minHeight / 3 - 2);
                                    data = data ? data : thisObj.dateTimeYear;

                                    if (i == 0 && j == 0) {
                                        divTd.innerHTML = "◀";
                                        divTd.onclick = function () {
                                            deletNodes(divYearChoice);
                                            divYearChoice.appendChild(createTable(TableType.Year, data - 8));
                                            thisObj.divDateTime.appendChild(divYearChoice);
                                        };
                                    }
                                    else if (i == 2 && j == 3) {
                                        divTd.innerHTML = "▶";
                                        divTd.onclick = function () {
                                            deletNodes(divYearChoice);
                                            divYearChoice.appendChild(createTable(TableType.Year, data + 8));
                                            thisObj.divDateTime.appendChild(divYearChoice);
                                        };
                                    }
                                    else {
                                        divTd.innerHTML = data - (5 - i * 4 - j);
                                        divTd.setAttribute("Year", data - (5 - i * 4 - j));
                                        if (data - (5 - i * 4 - j) == thisObj.dateTimeYear) {
                                            divTd.style.color = "#fff";
                                            divTd.style.backgroundColor = "#2d97de";
                                        }
                                        ;
                                        divTd.onclick = function () {
                                            thisObj.dateTime.setFullYear(this.getAttribute("Year"));
                                            setDateTime(thisObj.dateTime);
                                            setShoDiv(divType.Content);
                                        };
                                    }
                                    divTr.appendChild(divTd)
                                }
                                ;
                                divTable.appendChild(divTr);
                            }
                            ;
                        }
                        else if (type == TableType.Month) {
                            for (var i = 0; i < 4; i++) {
                                var divTr = document.createElement("DIV");
                                for (var j = 0; j < 3; j++) {
                                    var divTd = createTd(divWidth / 3 - 2, minHeight / 4 - 2);
                                    divTd.innerHTML = thisObj.MonthList[i * 3 + j];
                                    divTd.setAttribute("Month", i * 3 + j);
                                    if (i * 3 + j + 1 == thisObj.dateTimeMonth) {
                                        divTd.style.color = "#fff";
                                        divTd.style.backgroundColor = "#2d97de";
                                    }
                                    ;
                                    divTd.onclick = function () {
                                        thisObj.dateTime.setMonth(this.getAttribute("Month"));
                                        setDateTime(thisObj.dateTime);
                                        setShoDiv(divType.Content);
                                    };
                                    divTr.appendChild(divTd)
                                }
                                ;
                                divTable.appendChild(divTr);
                            }
                            ;
                        }
                        else if (type == TableType.Date) {
                            var daten = thisObj.getMonthDays(thisObj.dateTimeYear, thisObj.dateTimeMonth - 1),//取星期
                                x = new Date(thisObj.dateTimeYear, thisObj.dateTimeMonth - 1, 1).getDay();//每月1日
                            var trN = (((daten + x) % 7 > 0) ? (daten + x) / 7 + 1 : (daten + x) / 7);
                            for (var i = 0; i < trN; i++) {
                                var divTr = document.createElement("DIV");
                                for (var j = 0; j < 7; j++) {
                                    var divTd = createTd(divWidth / 7 - 2, minHeight / (trN + 1) - 2);
                                    if (i) {
                                        if ((i - 1) * 7 + j - x > -1 && (i - 1) * 7 + j - x < daten) {
                                            divTd.innerHTML = (i - 1) * 7 + j - x + 1;
                                            divTd.setAttribute("Data", (i - 1) * 7 + j - x + 1);
                                            if ((i - 1) * 7 + j - x + 1 == thisObj.dateTimeDate) {
                                                divTd.style.color = "#fff";
                                                divTd.style.backgroundColor = "#2d97de";
                                            }
                                            ;
                                            divTd.onclick = function () {
                                                thisObj.dateTime.setDate(this.getAttribute("Data"));
                                                setDateTime(thisObj.dateTime);
                                                setShoDiv(divType.Content);
                                            };
                                        }
                                        else
                                            divTd.innerHTML = " ";
                                    }
                                    else {
                                        divTd.innerHTML = thisObj.WeekList[j];
                                    }
                                    divTr.appendChild(divTd)
                                }
                                ;
                                divTable.appendChild(divTr);
                            }
                            ;
                        }
                        ;
                        return divTable;

                    };

                if (type == divType.DateTime) {
                    deletNodes(thisObj.divDateTime);
                    //divDateTime.style.top = divTop + "px";
                    //divDateTime.style.left = divLeft + "px";
                    thisObj.divDateTime.style.width = divWidth + "px";
                    thisObj.divDateTime.style.minWidth = minWidth + "px";
                    //thisObj.divDateTime.style.Height = rowHeight * 5 + "px";
                    thisObj.divDateTime.style.border = "solid #000 1px";
                    thisObj.divDateTime.style.textAlign = "center";
                    thisObj.divDateTime.style.vertAlign = "middle";
                    thisObj.divDateTime.style.display = "table-cell";
                    thisObj.divDateTime.style.overflow = "hidden";
                    thisObj.divDateTime.style.position = "absolute";
                    thisObj.divDateTime.style.zIndex = 9999;
                    thisObj.divDateTime.style.backgroundColor = "#fff";
                    thisObj.divDateTime.style.fontSize = "18px";
                    thisObj.divDateTime.style.textIndent = "0px";
                    thisObj.divDateTime.style.fontFamily = "楷体，微软雅黑";
                    thisObj.divDateTime.style.fontWeight = "normal";
                    thisObj.divDateTime.style.display = "none";
                    thisObj.divDateTime.style.color = "#000";
                    thisObj.divDateTime.onclick = function (e) {
                        e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
                    };
                    thisObj.divDateTime.appendChild(divContent);
                }
                else if (type == divType.Content) {
                    deletNodes(divContent);
                    //========== 年份容器 ==========
                    divYear = document.createElement("DIV");
                    setDivSryle(divYear);

                    divYearLeft = document.createElement("INPUT");
                    divYearLeft.setAttribute("type", "button");
                    divYearLeft.value = "◀";
                    setSpanSwitchSryle(divYearLeft);
                    divYearLeft.onclick = function () {
                        thisObj.dateTime.setFullYear(thisObj.dateTimeYear - 1);
                        setDateTime(thisObj.dateTime);
                    };
                    divYear.appendChild(divYearLeft);

                    divYearText = document.createElement("INPUT");
                    setDivInputSryle(divYearText);
                    divYearText.onclick = function () {
                        createDiv(divType.YearChoice);
                        setShoDiv(divType.YearChoice);
                    };
                    divYear.appendChild(divYearText);

                    divYearRight = document.createElement("INPUT");
                    divYearRight.setAttribute("type", "button");
                    divYearRight.value = "▶";
                    setSpanSwitchSryle(divYearRight);
                    divYearRight.onclick = function () {
                        thisObj.dateTime.setFullYear(thisObj.dateTimeYear + 1);
                        setDateTime(thisObj.dateTime);
                    };
                    divYear.appendChild(divYearRight);

                    var divYearLebel = document.createElement("LEBEL");
                    divYearLebel.innerHTML = "年";
                    divYearLebel.style.marginLeft = "7px";
                    divYear.appendChild(divYearLebel);
                    divContent.appendChild(divYear);
                    //==============================
                    //========= 月份容器 ===========
                    divMonth = document.createElement("DIV");
                    setDivSryle(divMonth);


                    divMonthLeft = document.createElement("INPUT");
                    divMonthLeft.setAttribute("type", "button");
                    divMonthLeft.value = "◀";
                    setSpanSwitchSryle(divMonthLeft);
                    divMonthLeft.onclick = function () {
                        thisObj.dateTime.setMonth(thisObj.dateTimeMonth - 2);
                        setDateTime(thisObj.dateTime);
                    };
                    divMonth.appendChild(divMonthLeft);

                    divMonthText = document.createElement("INPUT");
                    setDivInputSryle(divMonthText);
                    divMonthText.onclick = function () {
                        createDiv(divType.MonthChoice);
                        setShoDiv(divType.MonthChoice);
                    };
                    divMonthText.onmousemove = function () {
                        thisObj.divDateTime.style.display = "";
                    };
                    divMonth.appendChild(divMonthText);

                    //divMonthRight = document.createElement("SPAN");
                    divMonthRight = document.createElement("INPUT");
                    divMonthRight.setAttribute("type", "button");
                    divMonthRight.value = "▶";
                    setSpanSwitchSryle(divMonthRight);
                    divMonthRight.onclick = function () {
                        thisObj.dateTime.setMonth(thisObj.dateTimeMonth);
                        setDateTime(thisObj.dateTime);
                    };
                    divMonth.appendChild(divMonthRight);

                    var divMonthLebel = document.createElement("LEBEL");
                    divMonthLebel.innerHTML = "月";
                    divMonthLebel.style.marginLeft = "7px";
                    divMonth.appendChild(divMonthLebel);

                    divContent.appendChild(divMonth);
                    //==============================

                    //========= 日期容器 ===========
                    divDate = document.createElement("DIV");
                    setDivSryle(divDate);

                    divDateLeft = document.createElement("INPUT");
                    divDateLeft.setAttribute("type", "button");
                    divDateLeft.value = "◀";
                    setSpanSwitchSryle(divDateLeft);
                    divDateLeft.onclick = function () {
                        thisObj.dateTime.setDate(thisObj.dateTimeDate - 1);
                        setDateTime(thisObj.dateTime);
                    };
                    divDate.appendChild(divDateLeft);

                    divDateText = document.createElement("INPUT");
                    setDivInputSryle(divDateText);
                    divDateText.onclick = function () {
                        createDiv(divType.DateChoice);
                        setShoDiv(divType.DateChoice);
                    };
                    divDate.appendChild(divDateText);

                    divDateRight = document.createElement("INPUT");
                    divDateRight.setAttribute("type", "button");
                    divDateRight.value = "▶";
                    setSpanSwitchSryle(divDateRight);
                    divDateRight.onclick = function () {
                        thisObj.dateTime.setDate(thisObj.dateTimeDate + 1);
                        setDateTime(thisObj.dateTime);
                    };
                    divDate.appendChild(divDateRight);

                    var divDateLebel = document.createElement("LEBEL");
                    divDateLebel.innerHTML = "日";
                    divDateLebel.style.marginLeft = "7px";
                    divDate.appendChild(divDateLebel);

                    divContent.appendChild(divDate);

                    //当前时间信息容器
                    divInformation = document.createElement("DIV");
                    setDivSryle(divInformation);
                    divContent.appendChild(divInformation);

                    //按钮容器
                    var divBtn = document.createElement("DIV");
                    setDivSryle(divBtn);

                    btnToday = document.createElement("INPUT");
                    btnToday.setAttribute("type", "button");
                    btnToday.value = "今天";
                    setSpanSwitchSryle(btnToday);
                    btnToday.style.float = "left";
                    btnToday.onclick = function () {
                        setDateTime();
                    };
                    divBtn.appendChild(btnToday);


                    btnOk = document.createElement("INPUT");
                    btnOk.setAttribute("type", "button");
                    btnOk.value = "确定";
                    setSpanSwitchSryle(btnOk);
                    btnOk.style.float = "right";
                    btnOk.onclick = function () {
                        div.innerHTML = thisObj.formatDate(thisObj.dateTime, thisObj._dateFormat);
                        div.setAttribute("dateTimeYear", thisObj.dateTime.getFullYear());
                        div.setAttribute("dateTimeMonth", thisObj.dateTime.getMonth());
                        div.setAttribute("dateTimeDate", thisObj.dateTime.getDate());
                        thisObj.divDateTime.style.display = "none";
                        thisObj.Callback(thisObj.dateTime);
                    };
                    //spanBtnOk.style.marginRight="10px";
                    divBtn.appendChild(btnOk);

                    divContent.appendChild(divBtn);
                }
                else if (type == divType.YearChoice) {
                    deletNodes(divYearChoice);
                    divYearChoice.appendChild(createTable(TableType.Year));
                    thisObj.divDateTime.appendChild(divYearChoice);
                }
                else if (type == divType.MonthChoice) {
                    deletNodes(divMonthChoice);
                    divMonthChoice.appendChild(createTable(TableType.Month));
                    thisObj.divDateTime.appendChild(divMonthChoice);
                }
                else if (type == divType.DateChoice) {
                    deletNodes(divDateChoice);
                    divDateChoice.appendChild(createTable(TableType.Date));
                    thisObj.divDateTime.appendChild(divDateChoice);
                }

            },
            setShoDiv = function (type) {
                if (!type)type = divType.Content;
                divContent.style.display = (type == divType.Content ? "" : "none");
                divYearChoice.style.display = (type == divType.YearChoice ? "" : "none");
                divMonthChoice.style.display = (type == divType.MonthChoice ? "" : "none");
                divDateChoice.style.display = (type == divType.DateChoice ? "" : "none");

            },
            setShowMonthDate = function () {
                divMonth.style.display = (thisObj._isMonth ? "" : "none");
                divDate.style.display = (thisObj._isDate ? "" : "none");
                divInformation.style.display = (thisObj._isDate ? "" : "none");
                btnToday.value = thisObj._isMonth ? (thisObj._isDate ? "今天" : "本月") : "今年";
                thisObj.divDateTime.style.Height = thisObj._isMonth ? (thisObj._isDate ? rowHeight * 5 : rowHeight * 3) : rowHeight * 2;
            },


            isObj = function (obj, str) {
                var Timer, h;
                var SlideDown = function () {
                    var current = parseInt(obj.style.height);
                    if (current >= h) {
                        clearInterval(Timer);
                        //obj.style.height = h + "px";
                        obj.style.height = "";
                    }
                    else {
                        current += 2;
                        obj.style.height = current + "px";
                    }
                };
                var SlideUp = function () {
                    var current = parseInt(obj.style.height);
                    if (current <= 0) {
                        clearInterval(Timer);
                        obj.style.display = "none";
                    }
                    else {
                        current--;
                        obj.style.height = current + "px";
                    }
                };
                if (str) {
                    Timer = setInterval(SlideUp, 1);
                }
                else {
                    obj.style.height = "";
                    h = obj.offsetHeight;
                    obj.style.height = "1px";
                    Timer = setInterval(SlideDown, 1);
                }
            }

            ;


        this._isMonth = true;//是否有月
        this._isDate = true;//是否有日
        this.Callback;
        this._dateFormat = 'yyyy-MM-dd';//日期格式
        this.divDateTime = document.createElement("DIV");//弹出DIV
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
            //=============== 初始化 ===================
            /*for (var i in divType) {
             createDiv(divType[i]);
             }*/
            date = date || new Date();
            setDateTime(date);
            setShoDiv();
            setShowMonthDate();
            div.innerHTML = thisObj.formatDate(thisObj.dateTime, thisObj._dateFormat);
            div.setAttribute("dateTimeYear", thisObj.dateTime.getFullYear());
            div.setAttribute("dateTimeMonth", thisObj.dateTime.getMonth());
            div.setAttribute("dateTimeDate", thisObj.dateTime.getDate());
            thisObj.Callback = Callback || function (d) {
                };
            //==========================================
        };

        div.onclick = function (e) {
            e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
            thisObj.divDateTime.style.display = "";
            setShoDiv(divType.Content);

            var y = this.getAttribute("dateTimeYear");
            var m = this.getAttribute("dateTimeMonth");
            var d = this.getAttribute("dateTimeDate");
            if (y)
                setDateTime(new Date(parseInt(y), parseInt(m), parseInt(d)));
            //console.log("移动：" + new Date().getSeconds())

            divTop = div.offsetTop;
            /*+div.clientTop*/
            divLeft = div.offsetLeft;
            /*+div.clientLeft*/
            thisObj.divDateTime.style.top = divTop + "px";
            thisObj.divDateTime.style.left = divLeft + "px";


            //thisObj.divDateTime.style.display = "none";
            isObj(thisObj.divDateTime, "");
            //操作全局点击
            documentOnclick = document.onclick;
            document.onclick = function () {
                thisObj.divDateTime.style.display = "none";
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
                this._isMonth = (s.indexOf("M") > 0);
                this._isDate = (s.indexOf("d") > 0);
                this._dateFormat = s;
                this.DateTimeLoad(this.dateTime, this.Callback);
                return true;
            }
            ;
            return false;
        }
    };
})();
