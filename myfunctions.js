$(document).ready(function() {

$('.toggle-details').on('click', function() {
        // البحث عن صف التفاصيل التالي للسيارة أو عنصر التفاصيل وإظهاره اوإخفاؤه
        $(this).closest('tr').next('.car-details-row').toggle();
    });

    //تحقق من صحة مدخلات نموذج الحجز )
    $('#rentalForm').on('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        let errorMessage = "";

        let fullName = $('#fullName').val().trim();
        if (fullName !== "") {
            let arabicRegex = /^[\u0600-\u06FF\s]+$/;
            if (!arabicRegex.test(fullName)) {
                errorMessage += "الاسم الكامل يجب أن يتكون من أحرف عربية فقط.\n";
                isValid = false;
            }
        }

        //الرقم الوطني *
        let nationalId = $('#nationalId').val().trim();
        let nationalIdRegex = /^(0[1-9]|1[0-4])[0-9]{9}$/;
        if (nationalId === "") {
            errorMessage += "الرقم الوطني حقل إلزامي.\n";
            isValid = false;
        } else if (!nationalIdRegex.test(nationalId)) {
            errorMessage += "الرقم الوطني غير صالح (يجب أن يكون 11 خانة وتبدأ المحافظة بين 01 و 14).\n";
            isValid = false;
        }

        // تعيين تاريخ الحجز
        let startDateStr = $('#startDate').val().trim();
        if (startDateStr === "") {
            errorMessage += "تاريخ بداية التأجير حقل إلزامي.\n";
            isValid = false;
        }

        let endDateStr = $('#endDate').val().trim();
        if (endDateStr === "") {
            errorMessage += "تاريخ نهاية التأجير حقل إلزامي.\n";
            isValid = false;
        }

        if (startDateStr !== "" && endDateStr !== "") {
            let startDate = new Date(startDateStr);
            let endDate = new Date(endDateStr);
            if (endDate <= startDate) {
                errorMessage += "تاريخ نهاية التأجير يجب أن يكون لاحقاً لتاريخ البداية.\n";
                isValid = false;
            }
        }

        // رقم الموبايل*
        let mobile = $('#mobile').val().trim();
        if (mobile !== "") {
    //مراعاة شروط بداية الرقم(09)
            let mobileRegex = /^09[3-9][0-9]{7}$/;
            if (!mobileRegex.test(mobile)) {
                errorMessage += "رقم الموبايل غير صحيح (يجب أن يطابق شبكات Syriatel أو MTN).\n";
                isValid = false;
            }
        }

    
        let email = $('#email').val().trim();
        if (email !== "") {
            let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errorMessage += "البريد الإلكتروني المدخل غير صالح.\n";
                isValid = false;
            }
        }

        // رسالة خطأ
        if (!isValid) {
            alert("يرجى تصحيح الأخطاء التالية:\n\n" + errorMessage);
        } else {
            // حساب أيام التأجير والمبلغ الإجمالي وتطبيق الخصم (5% إذا تجاوزت 10 أيام)
            let start = new Date(startDateStr);
            let end = new Date(endDateStr);
            let timeDiff = end - start;
            let days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // عدد أيام التأجير

            
            let dailyRate = 300000; //مثال: 300,000 ل.س (يمكن استبداله بقيمة حقيقية من الجدول)
            let totalAmount = days * dailyRate;
            let discount = 0;

            if (days > 10) {
                discount = totalAmount * 0.05; // خصم 5%
                totalAmount -= discount;
            }
              // رسالة نجاح الحجز
            let resultMessage = "تم الحجز بنجاح!\n\n" +
                                "عدد أيام التأجير: " + days + " يوم\n" +
                                "المبلغ قبل الخصم: " + (days * dailyRate) + " ل.س\n" +
                                (days > 10 ? "تم تطبيق خصم 5%: " + discount + " ل.س\n" : "") +
                                "المبلغ الإجمالي النهائي: " + totalAmount + " ل.س";

            alert(resultMessage);
            
        
            this.submit();
        }
    });

});