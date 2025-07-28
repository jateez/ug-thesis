import http from "k6/http";
import { check, group } from "k6";
import { generateBlogPost } from "./loadtest.js";
export const BASE_URL = "http://localhost:3000/api";

export const options = {
  vus: 1,
};

export default function () {
  const payload = JSON.stringify(generateBlogPost(3));
  let response;
  group("ORM Tests", () => {
    response = http.post(BASE_URL + "/blogs/orm", payload, {
      headers: { "Content-Type": "application/json" },
    });

    check(response, {
      "is status 201": (r) => r.status === 201,
      "has correct blog ID": (r) => {
        const data = JSON.parse(r.body).data;
        return data && data.id > 0;
      },
    });

    console.log("ORM Write success");
    response = http.get(BASE_URL + "/blogs/orm/1");
    response = http.get(BASE_URL + "/blogs/orm/1");

    check(response, {
      "is status 200": (r) => r.status === 200,
      "has correct blog ID": (r) => {
        const data = JSON.parse(r.body).data;
        return data && data.id === 1;
      },
    });
    console.log("ORM Read detail success");

    check(response, {
      "is status 200": (r) => r.status === 200,
      "has correct blog ID": (r) => {
        const data = JSON.parse(r.body).data;
        return data && data.id === 1;
      },
    });
    console.log("ORM Read detail success");
  });
  group("Raw Query Tests", () => {
    response = http.post(BASE_URL + "/blogs/raw-query", payload, {
      headers: { "Content-Type": "application/json" },
    });

    check(response, {
      "is status 201": (r) => r.status === 201,
      "has correct blog ID": (r) => {
        const data = JSON.parse(r.body).data;
        return data && data.id > 0;
      },
    });

    console.log("Raw Query Write success");
    response = http.get(BASE_URL + "/blogs/raw-query/2");

    check(response, {
      "is status 200": (r) => r.status === 200,
      "has correct blog ID": (r) => {
        const data = JSON.parse(r.body).data;
        return data && data.id === 2;
      },
    });
    console.log("Raw Query Read success");
  });
}
