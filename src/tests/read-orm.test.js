import http from "k6/http";
import { check, sleep } from "k6";
import { BASE_URL } from "./loadtest.js";

const ORM_URL = BASE_URL + "/blogs/orm";

export const options = {
  scenarios: {
    // single_user_orm: {
    //   executor: "constant-arrival-rate",
    //   rate: 1,
    //   timeUnit: "5s",
    //   duration: "5m",
    //   preAllocatedVUs: 1,
    //   exec: "testORM",
    // },
    multi_user_orm: {
      executor: "constant-arrival-rate",
      rate: 30,
      timeUnit: "1s",
      duration: "5m",
      preAllocatedVUs: 30,
      exec: "readORM",
    },
  },
  thresholds: {
    checks: ["rate>0.9"],
  },
};

export function readORM() {
  const articleId = (__ITER % 50) + 1;
  const pageNum = (__ITER % 10) + 1;
  const res1 = http.get(ORM_URL + `?q=${pageNum}`);

  check(res1, {
    "is status 200": (r) => r.status === 200,
    "has correct pagination number": (r) => {
      try {
        const data = JSON.parse(r.body);
        const ok = data && data.page_number === pageNum;
        if (!ok) {
          console.error(
            `Check failed for pagination. Expected page ${pageNum}, got: ${JSON.stringify(data)}`,
          );
        }
        return ok;
      } catch (e) {
        console.error(`JSON parse error for pagination. Response: ${r.body}`);
        return false;
      }
    },
  });

  sleep(2);

  const res2 = http.get(ORM_URL + `/${articleId}`);
  check(res2, {
    "is status 200": (r) => r.status === 200,
    "has correct blog ID": (r) => {
      try {
        const data = JSON.parse(r.body).data;
        const ok = data && data.id === articleId;
        if (!ok) {
          console.error(
            `Check failed for blog ID. Expected ${articleId}, got: ${JSON.stringify(data)}`,
          );
        }
        return ok;
      } catch (e) {
        console.error(`JSON parse error for blog ID. Response: ${r.body}`);
        return false;
      }
    },
  });
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
    "summary-read-orm.json": JSON.stringify(data, null, 2),
    "avg-response-time.json": JSON.stringify(formatted_output, null, 2),
  };
}
