declare global {
  namespace App {
    interface PageData {
      lang?: import('$lib/data/site').Lang;
      messages?: import('$lib/data/site').Messages;
    }
  }
}

export {};
