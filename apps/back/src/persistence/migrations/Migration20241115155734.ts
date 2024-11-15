import { Migration } from '@mikro-orm/migrations';

export class Migration20241115155734 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "cluster" ("guid" uuid not null, "name" varchar(100) not null, "address" varchar(255) not null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "cluster_pkey" primary key ("guid"));`);
    this.addSql(`alter table "cluster" add constraint "cluster_name_address_unique" unique ("name", "address");`);

    this.addSql(`create table "cluster_location" ("guid" uuid not null, "cluster_guid" uuid not null, "location_id" varchar(50) not null, constraint "cluster_location_pkey" primary key ("guid"));`);

    this.addSql(`create table "document" ("guid" uuid not null, "id" varchar(32) not null, "type" varchar(3) not null, "year" smallint not null default 2024, "created_at" timestamptz not null, "updated_at" timestamptz not null, "properties" jsonb not null, constraint "document_pkey" primary key ("guid"));`);
    this.addSql(`alter table "document" add constraint "document_type_year_id_unique" unique ("type", "year", "id");`);

    this.addSql(`create table "worker_credentials" ("guid" uuid not null, "username" varchar(255) not null, "password_hash" varchar(255) not null, "is_suspended" boolean not null default false, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "worker_credentials_pkey" primary key ("guid"));`);
    this.addSql(`alter table "worker_credentials" add constraint "worker_credentials_username_unique" unique ("username");`);

    this.addSql(`create table "worker" ("guid" uuid not null, "given_name" varchar(100) not null, "surname" varchar(100) not null, "title" varchar(50) not null, "public_email" varchar(100) not null, "cluster_guid" uuid null, "credentials_guid" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "worker_pkey" primary key ("guid"));`);
    this.addSql(`alter table "worker" add constraint "worker_credentials_guid_unique" unique ("credentials_guid");`);

    this.addSql(`create table "assigned_document" ("guid" uuid not null, "document_guid" uuid not null, "worker_guid" uuid not null, "deadline" date null, "status" text check ("status" in ('processing', 'resolved', 'rejected', 'canceled')) not null default 'processing', "comment" varchar(256) null, "resulted_in_guid" uuid null, "created_at" timestamptz not null, "updated_at" timestamptz not null, constraint "assigned_document_pkey" primary key ("guid"));`);
    this.addSql(`alter table "assigned_document" add constraint "assigned_document_resulted_in_guid_unique" unique ("resulted_in_guid");`);
    this.addSql(`alter table "assigned_document" add constraint "assigned_document_document_guid_worker_guid_unique" unique ("document_guid", "worker_guid");`);

    this.addSql(`alter table "cluster_location" add constraint "cluster_location_cluster_guid_foreign" foreign key ("cluster_guid") references "cluster" ("guid") on update cascade;`);

    this.addSql(`alter table "worker" add constraint "worker_cluster_guid_foreign" foreign key ("cluster_guid") references "cluster" ("guid") on update cascade on delete set null;`);
    this.addSql(`alter table "worker" add constraint "worker_credentials_guid_foreign" foreign key ("credentials_guid") references "worker_credentials" ("guid") on update cascade on delete set null;`);

    this.addSql(`alter table "assigned_document" add constraint "assigned_document_document_guid_foreign" foreign key ("document_guid") references "document" ("guid") on update cascade;`);
    this.addSql(`alter table "assigned_document" add constraint "assigned_document_worker_guid_foreign" foreign key ("worker_guid") references "worker" ("guid") on update cascade;`);
    this.addSql(`alter table "assigned_document" add constraint "assigned_document_resulted_in_guid_foreign" foreign key ("resulted_in_guid") references "document" ("guid") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "cluster_location" drop constraint "cluster_location_cluster_guid_foreign";`);

    this.addSql(`alter table "worker" drop constraint "worker_cluster_guid_foreign";`);

    this.addSql(`alter table "assigned_document" drop constraint "assigned_document_document_guid_foreign";`);

    this.addSql(`alter table "assigned_document" drop constraint "assigned_document_resulted_in_guid_foreign";`);

    this.addSql(`alter table "worker" drop constraint "worker_credentials_guid_foreign";`);

    this.addSql(`alter table "assigned_document" drop constraint "assigned_document_worker_guid_foreign";`);

    this.addSql(`drop table if exists "cluster" cascade;`);

    this.addSql(`drop table if exists "cluster_location" cascade;`);

    this.addSql(`drop table if exists "document" cascade;`);

    this.addSql(`drop table if exists "worker_credentials" cascade;`);

    this.addSql(`drop table if exists "worker" cascade;`);

    this.addSql(`drop table if exists "assigned_document" cascade;`);
  }

}
