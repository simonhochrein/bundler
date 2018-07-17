export abstract class AbstractResolver {
    abstract isFor(FilePath: string): boolean;
    abstract crawl(FilePath: string, Done: () => void): void;
}