import http from "k6/http";
import { generateBlogPost, BASE_URL } from "./loadtest.js";
import { check, sleep } from "k6";

const ORM_URL = BASE_URL + "/blogs/orm";

export const options = {
  scenarios: {
    //    single_user_orm: {
    //      executor: "constant-arrival-rate",
    //      rate: 1,
    //      timeUnit: "5s",
    //      duration: "5m",
    //      preAllocatedVUs: 1,
    //      exec: "testORM",
    //    },
    multi_user_orm: {
      executor: "constant-arrival-rate",
      rate: 30,
      timeUnit: "1s",
      duration: "5m",
      preAllocatedVUs: 30,
      exec: "writeORM",
    },
  },
  thresholds: {
    checks: ["rate>0.9"],
  },
};

export function writeORM() {
  const inputNumber = (__ITER % 3) + 1;
  const payload = JSON.stringify(generateBlogPost(inputNumber));

  const response = http.post(ORM_URL, payload, {
    headers: { "Content-Type": "application/json" },
  });

  check(response, {
    "is status 201": (r) => r.status === 201,
    "has correct blog ID": (r) => {
      try {
        const data = JSON.parse(r.body).data;
        const ok = data && data.id > 0;
        if (!ok) {
          console.error(
            `Check failed for blog ID. Expected ID > 0, got: ${JSON.stringify(data)}`,
          );
        }
        return ok;
      } catch (e) {
        console.error(
          `JSON parse error for blog creation. Response: ${r.body}`,
        );
        return false;
      }
    },
  });

  console.log(`VU ${__VU} Iteration ${__ITER}: Used input ${inputNumber}`);
  console.log(`Response time was ${String(response.timings.duration)} ms`);
}

export function handleSummary(data) {
  const formatted_output = {
    http_req_duration: data.metrics.http_req_duration,
    http_req_success_duration:
      data["metrics"]["http_req_duration{expected_response:true}"],
    iteration_duration: data.metrics.iteration_duration,
    p90: data.metrics.http_req_duration.values["p(90)"],
    p95: data.metrics.http_req_duration.values["p(95)"],
    p99: data.metrics.http_req_duration.values["p(99)"],
  };

  return {
    "summary-write-orm.json": JSON.stringify(data, null, 2),
    "avg-response-time.json": JSON.stringify(formatted_output, null, 2),
  };
}
