      if(selectedService === "Exterior Contour Lighting" || selectedService === "Starlight + Exterior Contour"){
        detailLines.push(`Contour area: ${data.get("contourArea")}`);
        detailLines.push(`Contour color: ${data.get("contourColor")}`);
        detailLines.push(`Contour behavior: ${data.get("contourEffect")}`);
      }

      const body = [
        "NEW GALAXY CAR LIGHTS ENQUIRY",
        "",
        `Name: ${data.get("name")}`,
        `Phone: ${data.get("phone")}`,
        `Email: ${data.get("email")}`,
        "",
        `Vehicle: ${data.get("year")} ${data.get("make")} ${data.get("model")}`,
        `Service: ${selectedService}`,
        ...detailLines,
        "",
        "Build notes:",
        data.get("message") || "No additional notes.",
        "",
        "Sent from the Galaxy Car Lights website."
      ].join("\n");

      if(BUSINESS.email.includes("example.com")){
        status.classList.add("show");
        status.innerHTML = "<strong style='color:#f1d27a'>Prototype mode.</strong> Add the real business email in the BUSINESS settings near the bottom of this HTML file. The form is otherwise ready.";
        return;
      }

      window.location.href = `mailto:${BUSINESS.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });

    // Lightweight hero star field
    const canvas = document.getElementById("stars");
    const ctx = canvas.getContext("2d");
    let stars = [];
    function setupStars(){
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      ctx.setTransform(dpr,0,0,dpr,0,0);
      const count = Math.min(110, Math.floor(innerWidth / 11));
      stars = Array.from({length:count}, () => ({
        x: Math.random()*innerWidth,
        y: Math.random()*Math.min(innerHeight*.64, 620),
        r: Math.random()*1.05+.15,
        a: Math.random()*.55+.12,
        p: Math.random()*Math.PI*2,
        s: Math.random()*.012+.004
      }));
    }
    function drawStars(t=0){
      ctx.clearRect(0,0,innerWidth,innerHeight);
      stars.forEach(star => {
        const pulse = .62 + Math.sin(t*star.s + star.p)*.38;
        ctx.beginPath();
        ctx.arc(star.x,star.y,star.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(225,239,255,${star.a*pulse})`;
        ctx.fill();
      });
      requestAnimationFrame(drawStars);
    }
    setupStars();
    drawStars();
    addEventListener("resize", setupStars);