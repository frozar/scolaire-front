import { dataToL7Format } from "./workerUtils";

onmessage = function (e: { data: string }) {
  const URLtoFetch = e.data;
  fetch(URLtoFetch)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      if (data.length === 0) {
        postMessage(null);
        return;
      }

      const dataFormatL7 = dataToL7Format(data);

      postMessage(dataFormatL7);
    });
};

export {};
