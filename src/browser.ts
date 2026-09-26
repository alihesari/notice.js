// Entry for the <script> tag build: exposes the class as `window.NoticeJs`.
import { NoticeJs } from './notice';

(globalThis as typeof globalThis & { NoticeJs: typeof NoticeJs }).NoticeJs = NoticeJs;
