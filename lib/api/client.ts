import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000/api";
const USE_STUBS = process.env.NODE_ENV === "development" || !API_URL;

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_URL) {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    if (USE_STUBS) {
      return this.getStub<T>(endpoint);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    if (USE_STUBS) {
      return this.postStub<T>(endpoint, data);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  async postFormData<T>(endpoint: string, formData: FormData): Promise<T> {
    if (USE_STUBS) {
      return this.postFormDataStub<T>(endpoint, formData);
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return response.json();
  }

  // Stub implementations - route to stub data
  private async getStub<T>(endpoint: string): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Route to appropriate stub data
    if (endpoint === "/subjects") {
      const { SUBJECTS_STUB } = await import("./stubs/subjectsStub");
      return SUBJECTS_STUB as T;
    }

    if (endpoint.startsWith("/subjects/") && endpoint.endsWith("/topics")) {
      const subjectId = endpoint.split("/")[2];
      const { TOPICS_STUB } = await import("./stubs/subjectsStub");
      return (TOPICS_STUB[subjectId] || []) as T;
    }

    if (endpoint.startsWith("/practice/questions")) {
      const { SAMPLE_QUESTIONS_STUB } = await import("./stubs/questionsStub");
      return {
        sessionId: "session-" + Date.now(),
        questions: SAMPLE_QUESTIONS_STUB,
        metadata: {
          subject: "Math",
          topic: "Probability",
          difficulty: "Medium",
          totalQuestions: SAMPLE_QUESTIONS_STUB.length,
        },
      } as T;
    }

    if (endpoint === "/exams/current/questions") {
      const { EXAM_QUESTIONS_STUB } = await import("./stubs/questionsStub");
      return EXAM_QUESTIONS_STUB as T;
    }

    if (endpoint === "/leaderboard/school") {
      const { SCHOOL_LEADERS_STUB } = await import("./stubs/leaderboardStub");
      return SCHOOL_LEADERS_STUB as T;
    }

    if (endpoint === "/leaderboard/national") {
      const { SCHOOL_LEADERS_STUB } = await import("./stubs/leaderboardStub");
      return SCHOOL_LEADERS_STUB as T;
    }

    if (endpoint === "/leaderboard/schools") {
      const { SCHOOL_RANKING_STUB } = await import("./stubs/leaderboardStub");
      return SCHOOL_RANKING_STUB as T;
    }

    if (endpoint === "/users/me") {
      const { USER_PROFILE_STUB } = await import("./stubs/userStub");
      return USER_PROFILE_STUB as T;
    }

    if (endpoint === "/users/me/achievements") {
      const { ACHIEVEMENTS_STUB } = await import("./stubs/userStub");
      return ACHIEVEMENTS_STUB as T;
    }

    if (endpoint === "/users/me/progress") {
      const { SUBJECT_PROGRESS_STUB } = await import("./stubs/userStub");
      return SUBJECT_PROGRESS_STUB as T;
    }

    if (endpoint === "/users/me/teachers/posts") {
      const { TEACHER_POSTS_STUB } = await import("./stubs/teacherStub");
      return TEACHER_POSTS_STUB as T;
    }

    if (endpoint === "/teachers") {
      const { TEACHERS_STUB } = await import("./stubs/teacherStub");
      return TEACHERS_STUB as T;
    }

    throw new Error(`No stub implementation for endpoint: ${endpoint}`);
  }

  private async postStub<T>(endpoint: string, _data: unknown): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (endpoint.includes("/practice/sessions/") && endpoint.includes("/submit")) {
      return { score: 18 } as T;
    }

    if (endpoint === "/exams/current/submit") {
      return { score: 45, total: 50 } as T;
    }

    if (endpoint.includes("/follow")) {
      return { success: true } as T;
    }

    if (endpoint.includes("/unfollow")) {
      return { success: true } as T;
    }

    if (endpoint === "/users/me") {
      const { USER_PROFILE_STUB } = await import("./stubs/userStub");
      return USER_PROFILE_STUB as T;
    }

    throw new Error(`No stub implementation for POST endpoint: ${endpoint}`);
  }

  private async postFormDataStub<T>(endpoint: string, _formData: FormData): Promise<T> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 150));

    if (endpoint === "/scan/question") {
      const { SCAN_RESPONSE_STUB } = await import("./stubs/scanStub");
      return SCAN_RESPONSE_STUB as T;
    }

    if (endpoint === "/scan/grade") {
      const { UPLOAD_RESPONSE_STUB } = await import("./stubs/scanStub");
      return UPLOAD_RESPONSE_STUB as T;
    }

    throw new Error(`No stub implementation for form-data endpoint: ${endpoint}`);
  }
}

export const apiClient = new ApiClient();
