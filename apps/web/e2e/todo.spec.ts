import { test, expect } from "@playwright/test";

test.describe("Todo App", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/todos");
  });

  test("페이지 제목이 표시되어야 한다", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "나의 할 일 목록" })).toBeVisible();
  });

  test("할 일을 추가할 수 있어야 한다", async ({ page }) => {
    const input = page.getByPlaceholder("할 일을 입력하세요");
    const submitButton = page.getByRole("button", { name: "추가" });

    // 할 일 입력 및 추가
    await input.fill("E2E 테스트 할 일");
    await submitButton.click();

    // 추가된 할 일 확인
    await expect(page.getByText("E2E 테스트 할 일")).toBeVisible();
  });

  test("할 일을 완료 처리할 수 있어야 한다", async ({ page }) => {
    const input = page.getByPlaceholder("할 일을 입력하세요");
    const submitButton = page.getByRole("button", { name: "추가" });

    // 할 일 추가
    await input.fill("완료 테스트 할 일");
    await submitButton.click();

    // 체크박스 클릭하여 완료 처리
    const checkbox = page.getByRole("checkbox").first();
    await checkbox.click();

    // 완료 스타일 확인 (line-through)
    await expect(page.getByText("완료 테스트 할 일")).toHaveClass(/line-through/);
  });

  test("할 일을 삭제할 수 있어야 한다", async ({ page }) => {
    const input = page.getByPlaceholder("할 일을 입력하세요");
    const submitButton = page.getByRole("button", { name: "추가" });

    // 할 일 추가
    await input.fill("삭제 테스트 할 일");
    await submitButton.click();

    // 추가 확인
    await expect(page.getByText("삭제 테스트 할 일")).toBeVisible();

    // 삭제 버튼 클릭
    const deleteButton = page.getByRole("button", { name: "삭제" }).first();
    await deleteButton.click();

    // 삭제 확인
    await expect(page.getByText("삭제 테스트 할 일")).not.toBeVisible();
  });

  test("홈으로 이동할 수 있어야 한다", async ({ page }) => {
    const homeLink = page.getByRole("link", { name: "← 홈으로" });
    await homeLink.click();

    await expect(page).toHaveURL("/");
  });
});

test.describe("홈 페이지", () => {
  test("시작하기 버튼이 할 일 페이지로 이동해야 한다", async ({ page }) => {
    await page.goto("/");

    const startButton = page.getByRole("link", { name: "시작하기 →" });
    await startButton.click();

    await expect(page).toHaveURL("/todos");
  });
});
