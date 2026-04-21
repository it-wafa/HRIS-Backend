-- +goose Up
-- +goose StatementBegin
ALTER DATABASE hris SET timezone TO 'Asia/Jakarta';
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER DATABASE hris RESET timezone;
-- +goose StatementEnd