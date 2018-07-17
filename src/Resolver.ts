export interface IResolver {
    isFor(FilePath: string): boolean;
    crawl(FilePath: string, Done: () => void): void;
}