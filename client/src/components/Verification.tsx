import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { BiCopy } from "react-icons/bi";
import { AiFillCheckCircle } from "react-icons/ai";
import LoadingSpinner from "./UI/LoadingSpinner";
import VisibleCountdown from "./VisibleCountdown";

const Verification = () => {
  const [verificationStarted, setVerificationStarted] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [inputUsername, setInputUsername] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [awaitingVerification, setAwaitingVerification] =
    useState<boolean>(false);
  const [verificationData, setVerificationData] = useState<{
    status: string;
    username: string;
    uuid: string;
    timestamp: Date;
    isVerified: boolean;
  } | null>(null);

  function getTimeoutDate(timestamp: Date) {
    const timeoutDate = new Date(timestamp);
    timeoutDate.setMinutes(timeoutDate.getMinutes() + 1);
    return timeoutDate;
  }

  useEffect(() => {
    function verificationListener(clientId: string) {
      const eventSource = new EventSource(
        `http://localhost:5000/stream-verification?clientId=${clientId}`
      );
      eventSource.addEventListener("update", (event) => {
        eventSource.close();

        console.log("SSE connection closed.");
        console.log("Received verification update", event.data);
        const { message, isVerified } = JSON.parse(event.data);

        if (verificationData) {
          setVerificationData({
            ...verificationData,
            status: message,
            isVerified: isVerified,
          });
        }
        setAwaitingVerification(false);
      });
      return;
    }
    if (
      verificationData &&
      !verificationData.isVerified &&
      awaitingVerification
    ) {
      verificationListener(verificationData.uuid);
    }
    console.log(verificationData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationData]);

  async function beginVerification() {
    setErrorMessage(null);
    setVerificationData(null);
    setAwaitingVerification(false);
    setIsLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/verify-account",
        { username: inputUsername },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        const { status, username, uuid, timestamp } = response.data;
        const timestampObject = new Date(timestamp);
        const timeoutDate = getTimeoutDate(timestampObject);
        console.log("Timeout Date", timeoutDate);
        setIsLoading(false);
        setAwaitingVerification(true);
        setVerificationData({
          status,
          username,
          uuid,
          timestamp: timestampObject,
          isVerified: false,
        });
      } else {
        setIsLoading(false);
        setErrorMessage("User not found");
      }
    } catch (error) {
      const err = error as AxiosError<{ error: string }>;
      setAwaitingVerification(false);
      setVerificationData(null);
      setIsLoading(false);
      if (err.response && err.response.data && err.response.data.error) {
        setErrorMessage(err.response.data.error);
      } else {
        console.log(err);
        setErrorMessage("Error fetching from server");
      }
    }
  }

  return (
    <div className="flex flex-col items-center gap-7">
      <h2 className="text-4xl font-bold	">Verify Leetcode Account</h2>
      <p className=" text-center">
        Since leetcode doesn&apos;t provide third party app authentication, we
        came up with a crafty solution. To complete verification, you must add
        the unique ID we generate to your{" "}
        <a
          target="_blank"
          href="https://leetcode.com/profile/"
          className="text-blue-400"
        >
          leetcode &apos;summary&apos;
        </a>{" "}
        to confirm ownership of the account.
      </p>
      {verificationStarted ? (
        <>
          {verificationData && verificationData.isVerified ? null : (
            <div className="h-12 flex">
              <input
                type="text"
                placeholder="Enter Leetcode username"
                value={inputUsername}
                onChange={(e) => setInputUsername(e.target.value)}
                className="h-full bg-black text-white outline-none border border-r-0 py-1 px-3"
              />
              <button
                onClick={beginVerification}
                className="h-full px-3 border flex items-center disabled:cursor-not-allowed"
                disabled={
                  awaitingVerification || isLoading || !inputUsername.length
                }
              >
                {isLoading ? <LoadingSpinner /> : "Submit"}
              </button>
            </div>
          )}
          {verificationData && (
            <div className="flex flex-col gap-3 p-7 m-3 rounded border ">
              {!verificationData.isVerified ? (
                <>
                  <p>
                    {verificationData.status}{" "}
                    <span className="ml-2">
                      <VisibleCountdown
                        date={getTimeoutDate(verificationData.timestamp)}
                      />
                    </span>
                  </p>
                  <div
                    onClick={() => {
                      navigator.clipboard.writeText(verificationData.uuid);
                    }}
                    className="flex h-12 items-center p-3 border rounded gap-3 cursor-pointer hover:bg-[#ffffff08] transition-colors"
                  >
                    <p>{verificationData.uuid}</p>
                    <div>
                      <BiCopy size={24} />
                    </div>
                  </div>

                  <button
                    className={!awaitingVerification ? "block" : "hidden"}
                    onClick={beginVerification}
                  >
                    retry
                  </button>
                </>
              ) : (
                <>
                  {" "}
                  <div className="flex items-center gap-3">
                    <p>{`[${verificationData.username}]`}</p>
                    <p>{verificationData.status}</p>
                    <div className="text-green-400">
                      <AiFillCheckCircle size={30} />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {errorMessage && <p className="text-red-400">{errorMessage}</p>}
        </>
      ) : (
        <button
          onClick={() => setVerificationStarted(true)}
          className="px-3 py-1 border rounded"
        >
          Begin Verification
        </button>
      )}
    </div>
  );
};

export default Verification;
