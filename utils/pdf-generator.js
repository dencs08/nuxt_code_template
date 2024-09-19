import puppeteer from "puppeteer";
import http from "http";

// Check if the server is up
function checkServer(url) {
  return new Promise((resolve) => {
    http
      .get(url, (res) => {
        if (res.statusCode === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .on("error", () => resolve(false));
  });
}

(async () => {
  const url = "http://localhost:3000";

  // Wait for the server to be up
  let serverUp = false;
  while (!serverUp) {
    serverUp = await checkServer(url);
    if (!serverUp) {
      console.log("Waiting for server to be up...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle2" });

  await page.pdf({
    path: "output.pdf",
    format: "A4",
    printBackground: true,
    margin: {
      top: "10mm",
      right: "10mm",
      bottom: "10mm",
      left: "10mm",
    },
  });

  await browser.close();
  console.log("PDF generated successfully");
})();
