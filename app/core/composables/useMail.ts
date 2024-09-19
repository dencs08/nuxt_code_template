import { ref, computed } from "vue";
import { debounce } from "lodash-es";

interface EmailOptions {
  to: string;
  subject: string;
  bcc: string;
  text: string;
  html?: string;
  mjmlContent?: string;
}

export const useMail = (debounceMs = 300) => {
  const loading = ref(false);
  const error = ref<string | null>(null);
  const previewHtml = ref<string | null>(null);
  const mjmlContent = ref("");

  const sendMail = async (options: EmailOptions) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await useFetch("/api/v1/mail", {
        method: "POST",
        body: options,
      });

      if (response.error.value) {
        throw new Error(response.error.value.message || "Failed to send email");
      }

      return response.data.value;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const previewMjml = async (content: string) => {
    loading.value = true;
    error.value = null;
    previewHtml.value = null;

    try {
      const data = await $fetch("/api/v1/mail/mjml/render", {
        method: "POST",
        // params: { force: "true" },
        body: { mjmlContent: content },
      });

      previewHtml.value = data;
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "An unknown error occurred";
    } finally {
      loading.value = false;
    }
  };

  const debouncedPreviewMjml = debounce(previewMjml, debounceMs);

  const updateMjmlContent = (content: string) => {
    mjmlContent.value = content;
    debouncedPreviewMjml(content);
  };

  const generatePreview = async (content: string) => {
    try {
      const data = await $fetch("/api/v1/mail/mjml/render", {
        method: "POST",
        // params: { force: "true" },
        body: { mjmlContent: content },
      });
      return data;
    } catch (err) {
      console.error("Error generating preview:", err);
      return "<p>Error generating preview</p>";
    }
  };

  const previewLoading = computed(() => loading.value && !previewHtml.value);

  return {
    sendMail,
    updateMjmlContent,
    loading,
    previewLoading,
    error,
    previewHtml,
    mjmlContent,
    generatePreview,
  };
};
