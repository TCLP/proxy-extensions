#include <stdio.h>
#define _XOPEN_SOURCE
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <sys/stat.h>
#include <termios.h>
#include <stdint.h>
#include <errno.h>
#include <pthread.h>

int init_tcp(int *fd_proxy_s, uint32_t ip, uint16_t port);
int accept_tcp(int fd_proxy_s, int *fd_proxy_c);
int connect_tcp(int *fd_master_c, uint32_t ip, uint16_t port);
void *request_proc(void *arg);
void *reponse_proc(void *arg);

#define BUF_LEN 10240
uint8_t req_buf[BUF_LEN] = {'\0'};
uint8_t rep_buf[BUF_LEN] = {'\0'};

#define MAX_FD 1024
int fd_proxy_s = -1;
int fd_proxy_c[MAX_FD] = {-1};
int fd_master_c[MAX_FD] = {-1};

int main()
{
	int fd_index = 0;

	if(init_tcp(&fd_proxy_s, inet_addr("0.0.0.0"), 8090) == -1)
		return -1;
	while(1)
	{
		if(accept_tcp(fd_proxy_s, &(fd_proxy_c[fd_index])) == -1)
			return -1;
		printf("accept a new connection ...\n");
		if(connect_tcp(&(fd_master_c[fd_index]), inet_addr("127.0.0.1"), 8089) == -1)
			return -1;

		pthread_t thr1, thr2;
		
		int *thr_id1 = malloc(4);
		int *thr_id2 = malloc(4);
		*thr_id1 = fd_index;
		*thr_id2 = fd_index;
		pthread_create(&thr1, NULL, request_proc, thr_id1);
		pthread_detach(thr1);
		pthread_create(&thr2, NULL, reponse_proc, thr_id2);
		pthread_detach(thr2);

		fd_index++;	
	}
	return 0;
}

void *request_proc(void *arg)
{
	int fd_index = *((int *)arg);
	free(arg);

	int req_len = 0;
	while(1)
	{
		if((req_len = read(fd_proxy_c[fd_index], req_buf, BUF_LEN)) > 0)
			write(fd_master_c[fd_index], req_buf, req_len);
		else
			sleep(1);
	}
	return NULL;
}

void *reponse_proc(void *arg)
{
	int fd_index = *((int *)arg);
	free(arg);

	int rep_len = 0;
	while(1)
	{
		if((rep_len = read(fd_master_c[fd_index], rep_buf, BUF_LEN)) > 0)
			write(fd_proxy_c[fd_index], rep_buf, rep_len);
		else
			sleep(1);
	}
	return NULL;
}

int init_tcp(int *fd_proxy_s, uint32_t ip, uint16_t port)
{
	int ret_err = 0;
	
	struct sockaddr_in addr;
	
	*fd_proxy_s = socket(AF_INET, SOCK_STREAM, 0);
	if(*fd_proxy_s < 0)
	{
		printf("socket failed.\n");
		return -1;
	}
	int val = 1;
	ret_err = setsockopt(*fd_proxy_s, SOL_SOCKET, SO_REUSEADDR, &val, sizeof(val));
	if(ret_err)
	{
		printf("set reuse addr failed.\n");
		close(*fd_proxy_s);
		*fd_proxy_s = -1;
		return -1;
	}

	bzero(&addr, sizeof(addr));
	addr.sin_family = AF_INET;
	addr.sin_port = htons(port);
	addr.sin_addr.s_addr = ip;
	ret_err = bind(*fd_proxy_s, (struct sockaddr *)&addr, sizeof(addr));
	if(ret_err)
	{
		printf("bind failed...\n");
		close(*fd_proxy_s);
		*fd_proxy_s = -1;
		return -1;
	}
	else
		printf("bind success...\n");

	ret_err = listen(*fd_proxy_s, 10);
	if(ret_err)
	{
		printf("listen failed...\n");
		close(*fd_proxy_s);
		*fd_proxy_s = -1;
		return -1;
	}
	return 0;
}

int accept_tcp(int fd_proxy_s, int *fd_proxy_c)
{
	*fd_proxy_c = accept(fd_proxy_s, (struct sockaddr *)NULL, NULL);
	if(*fd_proxy_c == -1)
	{
		printf("accept failed...\n");
		*fd_proxy_c = -1;
		return -1;
	}
	return 0;
}

int connect_tcp(int *fd_master_c, uint32_t ip, uint16_t port)
{
	int ret_err = -1;
	
	struct sockaddr_in addr;
	*fd_master_c = socket(AF_INET, SOCK_STREAM, 0);
	if(*fd_master_c < 0)
	{
		printf("socket failed...\n");
		return -1;
	}

	bzero(&addr, sizeof(addr));
	addr.sin_family = AF_INET;
	addr.sin_port = htons(port);
	addr.sin_addr.s_addr = ip;
	
	ret_err = connect(*fd_master_c, (struct sockaddr *)&addr, sizeof(addr));
	if(ret_err < 0)
	{
		printf("connect failed...\n");
		close(*fd_master_c);
		*fd_master_c = -1;
		return -1;
	}
	return 0;
}
