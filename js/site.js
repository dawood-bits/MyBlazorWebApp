window.downloadGpaReport = (data) => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    // 🎨 Theme colors
    const themeColor = [25, 118, 210]; // Royal blue
    const gold = [218, 165, 32];
    const lightGray = [245, 245, 245];
    const textDark = [34, 34, 34];

    // 🏛️ HEADER - University Letterhead
    const universityName = data.universityName || "Your University Name";

    doc.setFillColor(...themeColor);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFont("times", "bold");
    doc.setFontSize(18);
    doc.text(universityName, 105, 18, { align: "center" });

    // 🪶 Add University Logo (if exists)
    const logo = new Image();
    logo.src = "/images/logo.png"; // place your logo in wwwroot/images/logo.png

    logo.onload = function () {
        doc.addImage(logo, "PNG", 15, 5, 18, 18);
        finish();
    };
    logo.onerror = function () {
        finish();
    };

    function finish() {
        // 🌊 WATERMARK (transparent seal)
        const watermark = new Image();
        watermark.src = "/images/seal.png"; // optional watermark
        watermark.onload = function () {
            doc.addImage(watermark, "PNG", 45, 90, 120, 120, "", "FAST", 0.1);
            buildContent();
        };
        watermark.onerror = function () {
            buildContent();
        };
    }

    function buildContent() {
        let y = 40;

        // 🧍 Student Info
        doc.setTextColor(...textDark);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Student Name: ${data.studentName}`, 15, y);
        doc.text(`Date: ${data.date}`, 195, y, { align: "right" });

        y += 10;
        doc.setDrawColor(...themeColor);
        doc.setLineWidth(0.5);
        doc.line(15, y, 195, y);
        y += 10;

        // 🧾 Table Header
        doc.setFillColor(...lightGray);
        doc.rect(15, y - 6, 180, 10, "F");
        doc.setFont("helvetica", "bold");
        doc.text("No", 18, y);
        doc.text("Subject", 40, y);
        doc.text("Grade", 130, y);
        doc.text("Credit Hours", 170, y, { align: "right" });
        y += 5;

        // 📚 Table Rows
        doc.setFont("helvetica", "normal");
        data.subjects.forEach((s, i) => {
            y += 8;
            doc.text(String(i + 1), 18, y);
            doc.text(s.name || "-", 40, y);
            doc.text(s.grade || "-", 130, y);
            doc.text(String(s.creditHours), 170, y, { align: "right" });
            doc.setDrawColor(230, 230, 230);
            doc.line(15, y + 2, 195, y + 2);
        });

        // 🎓 GPA Box
        y += 20;
        doc.setDrawColor(...themeColor);
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(15, y, 180, 35, 4, 4, "FD");

        doc.setFont("times", "bold");
        doc.setTextColor(...themeColor);
        doc.setFontSize(16);
        doc.text("Final GPA Report", 105, y + 10, { align: "center" });

        doc.setFontSize(14);
        doc.setTextColor(...textDark);
        doc.text(`GPA: ${data.gpa}`, 105, y + 20, { align: "center" });

        // 🎖️ Remark Badge
        const remarkColors = {
            Excellent: [56, 142, 60],
            Good: [255, 193, 7],
            Average: [33, 150, 243],
            "Below Average": [244, 67, 54],
            Poor: [158, 158, 158]
        };

        const remarkColor = remarkColors[data.remark] || [100, 100, 100];
        doc.setFillColor(...remarkColor);
        doc.setTextColor(255, 255, 255);
        doc.roundedRect(140, y + 23, 45, 10, 3, 3, "F");
        doc.text(data.remark.toUpperCase(), 162, y + 30, { align: "center" });

        // 🖋️ Signature + Seal
        y += 55;
        doc.setDrawColor(180, 180, 180);
        doc.line(30, y, 80, y);
        doc.text("Authorized Signature", 30, y + 6);

        // Add bottom seal if available
        const seal = new Image();
        seal.src = "/images/seal.png";
        seal.onload = function () {
            doc.addImage(seal, "PNG", 150, y - 10, 30, 30, "", "FAST");
            footer();
        };
        seal.onerror = footer;
    }

    function footer() {
        // 📄 Footer
        doc.setFontSize(10);
        doc.setTextColor(120, 120, 120);
        doc.text("Official Report | Generated via Smart GPA Calculator © 2025", 105, 285, { align: "center" });

        // 💾 Save PDF
        const filename = `${universityName.replace(/\s+/g, "_")}_${data.studentName.replace(/\s+/g, "_")}_GPA_Report.pdf`;
        doc.save(filename);
    }
};
