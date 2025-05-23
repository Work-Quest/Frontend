export interface Item {
  id: number;
  name: string;
}

const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

if (!BASE_URL) {
  throw new Error('VITE_API_URL is not defined in your .env file');
}

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  // 'Authorization': `Bearer ${yourToken}`, // uncomment if using auth
};

const TIMEOUT_MS = 10000;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${response.status} ${response.statusText} - ${errorText}`);
  }
  return await response.json() as T;
}

async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, ms);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export async function fetchItems(url: string): Promise<Item[]> {
  try {
    const response = await timeout(
      fetch(`${BASE_URL}/${url}`, {
        method: 'GET',
        headers: DEFAULT_HEADERS,
        credentials: 'include', // sends cookies (optional)
      }),
      TIMEOUT_MS
    );
    return handleResponse<Item[]>(response);
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

export async function postData<T, U>(url: string, data: T): Promise<U> {
  try {
    const response = await timeout(
      fetch(`${BASE_URL}/${url}`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify(data),
        // credentials: 'include', // sends cookies (optional)
      }),
      TIMEOUT_MS
    );
    return handleResponse<U>(response);
  } catch (error) {
    console.error('Post request failed:', error);
    throw error;
  }
}
