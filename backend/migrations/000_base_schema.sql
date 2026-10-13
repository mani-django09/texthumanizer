-- Base schema (users, history, activity logs, affiliate applications, password reset tokens).
-- Schema only, no data. Exported from production with pg_dump; apply before 001_billing.sql.

--
-- PostgreSQL database dump
--

\restrict g3pSQOA5PtojATmvCTa1Vm1E3QEqIQPXTQWHGJDXc61vOjeaEPOtze8i8ikOG1R

-- Dumped from database version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: activity_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activity_logs (
    id integer NOT NULL,
    user_id integer,
    event_type character varying(50) NOT NULL,
    metadata jsonb,
    ip_address character varying(45),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: activity_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activity_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activity_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activity_logs_id_seq OWNED BY public.activity_logs.id;


--
-- Name: affiliate_applications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.affiliate_applications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    website character varying(500),
    audience_description text,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    affiliate_code character varying(12),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: affiliate_applications_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.affiliate_applications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: affiliate_applications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.affiliate_applications_id_seq OWNED BY public.affiliate_applications.id;


--
-- Name: humanize_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.humanize_history (
    id integer NOT NULL,
    user_id integer NOT NULL,
    input_text text NOT NULL,
    output_text text NOT NULL,
    word_count integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: humanize_history_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.humanize_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: humanize_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.humanize_history_id_seq OWNED BY public.humanize_history.id;


--
-- Name: password_reset_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.password_reset_tokens (
    id integer NOT NULL,
    user_id integer NOT NULL,
    token_hash character varying(255) NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.password_reset_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: password_reset_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.password_reset_tokens_id_seq OWNED BY public.password_reset_tokens.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash character varying(255),
    google_id character varying(255),
    name character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    referral_code character varying(12),
    referred_by integer,
    bonus_words integer DEFAULT 0 NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: activity_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs ALTER COLUMN id SET DEFAULT nextval('public.activity_logs_id_seq'::regclass);


--
-- Name: affiliate_applications id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliate_applications ALTER COLUMN id SET DEFAULT nextval('public.affiliate_applications_id_seq'::regclass);


--
-- Name: humanize_history id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.humanize_history ALTER COLUMN id SET DEFAULT nextval('public.humanize_history_id_seq'::regclass);


--
-- Name: password_reset_tokens id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens ALTER COLUMN id SET DEFAULT nextval('public.password_reset_tokens_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: activity_logs activity_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_pkey PRIMARY KEY (id);


--
-- Name: affiliate_applications affiliate_applications_affiliate_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliate_applications
    ADD CONSTRAINT affiliate_applications_affiliate_code_key UNIQUE (affiliate_code);


--
-- Name: affiliate_applications affiliate_applications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliate_applications
    ADD CONSTRAINT affiliate_applications_pkey PRIMARY KEY (id);


--
-- Name: humanize_history humanize_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.humanize_history
    ADD CONSTRAINT humanize_history_pkey PRIMARY KEY (id);


--
-- Name: password_reset_tokens password_reset_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_pkey PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_google_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_google_id_key UNIQUE (google_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_referral_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referral_code_key UNIQUE (referral_code);


--
-- Name: idx_activity_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_created_at ON public.activity_logs USING btree (created_at DESC);


--
-- Name: idx_activity_event_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_event_type ON public.activity_logs USING btree (event_type);


--
-- Name: idx_activity_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_activity_user_id ON public.activity_logs USING btree (user_id);


--
-- Name: idx_affiliate_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_affiliate_user_id ON public.affiliate_applications USING btree (user_id);


--
-- Name: idx_history_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_history_created_at ON public.humanize_history USING btree (created_at DESC);


--
-- Name: idx_history_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_history_user_id ON public.humanize_history USING btree (user_id);


--
-- Name: idx_reset_token_hash; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reset_token_hash ON public.password_reset_tokens USING btree (token_hash);


--
-- Name: idx_reset_token_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_reset_token_user ON public.password_reset_tokens USING btree (user_id);


--
-- Name: idx_users_referral_code; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_referral_code ON public.users USING btree (referral_code);


--
-- Name: activity_logs activity_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activity_logs
    ADD CONSTRAINT activity_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: affiliate_applications affiliate_applications_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.affiliate_applications
    ADD CONSTRAINT affiliate_applications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: humanize_history humanize_history_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.humanize_history
    ADD CONSTRAINT humanize_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: password_reset_tokens password_reset_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.password_reset_tokens
    ADD CONSTRAINT password_reset_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: users users_referred_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_referred_by_fkey FOREIGN KEY (referred_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict g3pSQOA5PtojATmvCTa1Vm1E3QEqIQPXTQWHGJDXc61vOjeaEPOtze8i8ikOG1R

